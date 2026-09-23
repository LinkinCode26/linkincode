import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Montamos las rutas de autenticación y el router principal de la API
app.use("/api/auth", authRoutes);
app.use("/api", routes);

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({ status: "error", message: "Error interno del servidor" });
});

export default app;
