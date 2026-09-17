import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // Verificamos si el header Authorization existe y empieza con "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Separamos "Bearer" del token real
      token = req.headers.authorization.split(" ")[1];

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET no está definido en el entorno");
      }

      // Decodificamos y verificamos el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscamos al usuario en la DB (excluyendo la contraseña) y lo inyectamos en req.user
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Todo ok, pasa al siguiente controlador
    } catch (error) {
      console.error("Error en auth middleware:", error.message);
      return res
        .status(401)
        .json({ message: "No autorizado, el token falló o expiró" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "No autorizado, no se proporcionó un token" });
  }
};
