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
    // 1. Guardar el lead en la base de datos
    const lead = await createLead(parsed.data);

    // 2. Disparar los correos sin bloquear ni romper si falla SMTP
    try {
      // Usamos los datos guardados o parsed.data
      const leadInfo = lead || parsed.data;

      await Promise.allSettled([
        sendLeadNotificationToTeam(leadInfo),
        sendLeadAutoReply(leadInfo),
      ]);
    } catch (mailError) {
      // Si el servidor de correos falla, solo lo registramos en consola
      console.error("[Email Warning] Error al intentar enviar las notificaciones:", mailError);
    }

    // 3. Devolver la respuesta exitosa al frontend
    return res.status(201).json({
      status: "ok",
      lead,
    });
  } catch (error) {
    // Si falla la BD o algo crítico, pasa al middleware de error
    next(error);
  }
};