import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protege una ruta: exige `Authorization: Bearer <token>` con un JWT firmado
// por esta API, vigente, y de un usuario que todavía existe.
// Uso: router.get("/algo", protect, controlador)
export const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No autorizado: falta el token" });
  }

  let decoded;
  try {
    decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  // Si esto falla (ej: base caída) Express 5 lo envía al manejador de errores.
  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  req.user = user;
  next();
};

export default protect;
