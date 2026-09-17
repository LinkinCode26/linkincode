import express from "express";
import { getUsers } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Aplicamos el middleware "protect" a la ruta principal
router.get("/", protect, getUsers);

export default router;
