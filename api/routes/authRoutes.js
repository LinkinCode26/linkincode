import express from "express";
import rateLimit from "express-rate-limit";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Máximo 5 intentos de login cada 15 minutos por IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message:
      "Demasiados intentos de inicio de sesión. Por favor intenta de nuevo en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", register);
router.post("/login", loginLimiter, login);

export default router;
