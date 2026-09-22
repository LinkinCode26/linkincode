import express from "express";
import rateLimit from "express-rate-limit";
import { register, login, me } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.middleware.js";

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
router.get("/me", protect, me);

export default router;
