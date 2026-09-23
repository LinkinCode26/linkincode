import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Necesario detrás de un proxy para que req.ip sea la IP real del visitante, no la del proxy.
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", routes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({ status: "error", message: "Error interno del servidor" });


});

export default app;
