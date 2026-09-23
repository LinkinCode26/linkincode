import { z } from "zod";
import { createLead } from "../services/leads.service.js";

const leadSchema = z.object({
 nombre: z.string().trim().min(1, "el nombre es obligatorio").max(100, "el nombre es demasiado largo"),
  email: z.email("el email no es válido").trim().max(150, "el email es demasiado largo"),
  tipoProyecto: z.string().trim().min(1, "el tipo de Proyecto es obligatorio").max(100, "el tipo de proyecto es demasiado largo"),
  mensaje: z.string().trim().min(1, "el mensaje es obligatorio").max(2000, "el mensaje es demasiado largo"),
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
