import { z } from "zod";
import { createLead } from "../services/leads.service.js";

const leadSchema = z.object({
  nombre: z.string().trim().min(1, "el nombre es obligatorio"),
  email: z.string().trim().email("el email no es válido"),
  tipoProyecto: z.string().trim().min(1, "el tipo de Proyecto es obligatorio"),
  mensaje: z.string().trim().min(1, "el mensaje es obligatorio"),
  origen: z.string().optional(),
  website: z.string().optional(),
});

export const postLead = async (req, res, next) => {
  const parsed = leadSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      status: "error",
      errors: z.flattenError(parsed.error).fieldErrors, //método de Zod que te devuelve los errores organizados por campo
    });
  }

  // Honeypot: si viene completo, es un bot. Respondemos como si todo hubiera salido bien, sin guardar nada, para no delatar que fue detectado.
  if (parsed.data.website) {
    return res.status(201).json({ status: "ok" });
  }

  try {
    const lead = await createLead(parsed.data);

    return res.status(201).json({
      status: "ok",
      lead,
    });
  } catch (error) {
    next(error);
  }
};
