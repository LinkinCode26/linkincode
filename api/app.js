import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {  
  const dbState = mongoose.connection.readyState;
  res.status(200).json({
    status: "ok",
    db: dbState === 1 ? "connected" : "disconnected",
  });
});

export default app;
