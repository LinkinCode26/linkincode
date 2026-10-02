import jwt from "jsonwebtoken";
import { z } from "zod";
import { findUserByEmail, createUser } from "../services/auth.service.js";

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en las variables de entorno");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1).max(150),
  password: z.string().min(1).max(72), // 72 = límite de bcrypt
});

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().max(150).pipe(z.email()),
  password: z.string().min(6).max(72),
});

// @route POST /api/auth/register (privado: requiere token de un admin)
export const register = async (req, res, next) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Datos de usuario inválidos" });
  }
  try {
    const { email, password } = parsed.data;
    if (await findUserByEmail(email)) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }
    const user = await createUser({ email, password });
    return res.status(201).json({ _id: user._id, email: user.email });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/auth/login
export const login = async (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Email y contraseña son obligatorios" });
  }
  try {
    const { email, password } = parsed.data;
    const user = await findUserByEmail(email);

    if (user && (await user.matchPassword(password))) {
      return res.json({ _id: user._id, email: user.email, token: generateToken(user._id) });
    }
    return res.status(401).json({ message: "Email o contraseña incorrectos" });
  } catch (error) {
    next(error);
  }
};

export const me = (req, res) => {
  res.json({ _id: req.user._id, email: req.user.email });
};