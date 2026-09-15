import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Función helper para generar el token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "linkincode_secret_dev", {
    expiresIn: "1d", // Expira en 1 día
  });
};

// @desc    Registrar un nuevo administrador/usuario (Opcional pero necesario para crear el primero)
// @route   POST /api/auth/register
export const register = async (req, res) => {
  console.log("🟡 Entró al endpoint /register con body:", req.body);
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const user = await User.create({ email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Datos de usuario inválidos" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// @desc    Autenticar usuario y conseguir token (Login)
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscamos al usuario por su email
    const user = await User.findOne({ email });

    // Verificamos si existe y si la contraseña coincide
    if (user && (await user.matchPassword(password))) {
      // Criterio 2: Login devuelve token válido con expiración
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      // Criterio 3: Login con credenciales inválidas devuelve 401
      res.status(401).json({ message: "Email o contraseña incorrectos" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};
