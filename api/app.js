import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";

const app = express();

// Necesario detrás de un proxy (Render/Vercel) para que req.ip sea la IP real del visitante
app.set("trust proxy", 1);

app.use(helmet());

// Orígenes permitidos según los dominios de producción y desarrollo local
const allowedOrigins = [
  "https://linkincode.com",
  "https://www.linkincode.com",
  "https://linkincodepage.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite solicitudes sin origin (como Postman, mobile o health checks)
      // o aquellas que provengan de la lista autorizada
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Acceso bloqueado por política de CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Endpoint de prueba/health check para verificar rápido en Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err.message === "Acceso bloqueado por política de CORS") {
    return res.status(403).json({ status: "error", message: err.message });
  }

  const status = err.status ?? err.statusCode;
  if (status >= 400 && status < 500) {
    return res.status(status).json({
      status: "error",
      message:
        err.type === "entity.parse.failed"
          ? "JSON inválido"
          : "Solicitud inválida",
    });
  }

  console.error(err);
  res.status(500).json({ status: "error", message: "Error interno del servidor" });
});

export default app;