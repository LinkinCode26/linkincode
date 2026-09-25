import { z } from "zod";
import { createLead } from "../services/leads.service.js";
import { sendLeadNotificationToTeam, sendLeadAutoReply } from "../services/emailService.js";

const leadSchema = z.object({
  nombre: z.string().trim().min(1, "el nombre es obligatorio"),
  email: z.string().trim().email("el email no es válido"),
  tipoProyecto: z.string().trim().min(1, "el tipo de Proyecto es obligatorio"),
  mensaje: z.string().trim().min(1, "el mensaje es obligatorio"),
  origen: z.string().optional(),
});

export const postLead = async (req, res, next) => {
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
    return res.status(201).json({
      status: "ok",
      lead,
    });
  } catch (error) {
    next(error);
  }
};