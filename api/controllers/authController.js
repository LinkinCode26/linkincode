import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../services/auth.service.js"

// Función helper para generar el token JWT
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en las variables de entorno");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// @desc    Registrar un nuevo administrador/usuario
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userExists = await findUserByEmail( email );

    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const user = await createUser({ email, password });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    }

    return res.status(400).json({ message: "Datos de usuario inválidos" });
  } catch (error) {
    next(error);
  }
};

// @desc    Autenticar usuario y conseguir token (Login)
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    }

    return res.status(401).json({ message: "Email o contraseña incorrectos" });
  } catch (error) {
    next(error);
  }
};

// @desc    Devolver el usuario de la sesión actual (valida el token)
// @route   GET /api/auth/me
// @access  Privado (middleware `protect`)
export const me = (req, res) => {
  res.json({ _id: req.user._id, email: req.user.email });
};
