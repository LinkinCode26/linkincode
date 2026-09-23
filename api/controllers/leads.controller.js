import { z } from "zod";
import { createLead, getFilteredLeads } from "../services/leads.service.js"; // <-- Importamos getFilteredLeads

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

export const postLead = async (req, res, next) => {
  if (req.body?.website) {
    return res.status(201).json({ status: "ok" });
  }

  const parsed = leadSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      status: "error",
      errors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  try {
    const lead = await createLead(parsed.data);
    return res.status(201).json({ status: "ok", lead });
  } catch (error) {
    next(error);
  }
};

//Controlador para obtener leads paginados y filtrados
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
