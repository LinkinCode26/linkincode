import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";


const app = express();

// Necesario detrás de un proxy para que req.ip sea la IP real del visitante, no la del proxy.
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());
app.use(express.json());


app.use("/api", routes);

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  const status = err.status ?? err.statusCode;
  if (status >= 400 && status < 500) {
    return res.status(status).json({
      status: "error",
      message: err.type === "entity.parse.failed" ? "JSON inválido" : "Solicitud inválida",
    });
  }

  console.error(err);
  res.status(500).json({ status: "error", message: "Error interno del servidor" });
});

export default app;
