import { z } from "zod";
import mongoose from "mongoose";
import {
  createLead,
  getFilteredLeads,
  updateLeadStatus,
  getLeadCountsByProject,
} from "../services/leads.service.js";
import { sendLeadNotificationToTeam, sendLeadAutoReply } from "../services/emailService.js";

const leadSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "el nombre es obligatorio")
    .max(100, "el nombre es demasiado largo"),
  email: z
    .email("el email no es válido")
    .trim()
    .max(150, "el email es demasiado largo"),
  tipoProyecto: z
    .string()
    .trim()
    .min(1, "el tipo de Proyecto es obligatorio")
    .max(100, "el tipo de proyecto es demasiado largo"),
  mensaje: z
    .string()
    .trim()
    .min(1, "el mensaje es obligatorio")
    .max(2000, "el mensaje es demasiado largo"),
  origen: z.string().optional(),
  website: z.string().optional(),
});

const estadoSchema = z.object({
  estado: z.string().trim().toLowerCase().pipe(
    z.enum(['nuevo', 'contactado', 'ganado', 'perdido'])
  ),
});

export const postLead = async (req, res, next) => {
  if (req.body?.website) {
    return res.status(201).json({ status: "ok" });
  }

  const parsed = leadSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      status: "error",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    // 1. Guardar primero en la base de datos
    const lead = await createLead(parsed.data);
    const leadInfo = lead || parsed.data;

    // 2. Despachar emails en segundo plano (fire-and-forget con logging de fallos)
    // Sin 'await' para responder al cliente de inmediato sin esperar la latencia SMTP
    Promise.allSettled([
      sendLeadNotificationToTeam(leadInfo),
      sendLeadAutoReply(leadInfo),
    ]).then((results) => {
      results.forEach((r) => {
        if (r.status === "rejected") {
          console.error("[Email Error]:", r.reason);
        }
      });
    });

    // 3. Responder de inmediato con el 201
    return res.status(201).json({ status: "ok", lead });
  } catch (error) {
    next(error);
  }
};

// Controlador para obtener leads paginados y filtrados
export const getLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const queryFilters = {};
    if (req.query.tipoProyecto) {
      queryFilters.tipoProyecto = {
        $regex: req.query.tipoProyecto,
        $options: "i",
      };
    }
    if (req.query.estado) {
      queryFilters.estado = req.query.estado;
    }

    const { leads, total } = await getFilteredLeads(queryFilters, skip, limit);

    return res.status(200).json({
      status: "ok",
      data: leads,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const patchLeadStatus = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "error",
      message: "El id no tiene un format valido",
    });
  }

  const parsed = estadoSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Estado inválido. Los valores permitidos son: nuevo, contactado, ganado, perdido',
    });
  }

  try {
    const lead = await updateLeadStatus(id, parsed.data.estado);

    if (!lead) {
      return res
        .status(404)
        .json({ status: "error", message: "Lead no encontrado" });
    }

    return res.status(200).json({ status: "ok", lead });
  } catch (error) {
    next(error);
  }
};

export const getLeadStats = async (req, res, next) => {
  try {
    const data = await getLeadCountsByProject();
    return res.status(200).json({ status: "ok", data });
  } catch (error) {
    next(error);
  }
};
