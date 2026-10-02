import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Lead from "../models/Lead.js";

const TIPOS = [
  "Landing Pages", "Landing Page", "E-commerce", "APIs REST y Backends",
  "Dashboards y Paneles Admin", "Control de Stock", "Gestión de Personal",
  "Facturación Digital", "Digital Billing", "Proyecto a medida",
];
const ESTADOS = ["nuevo", "contactado", "ganado", "perdido"];

try {
  await connectDB();
  await Lead.deleteMany({ origen: "seed-qa" });
  if (!process.argv.includes("--clean")) {
    const docs = Array.from({ length: 30 }, (_, i) => ({
      nombre: `QA Lead ${i + 1}`,
      email: `qa${i + 1}@ejemplo.com`,
      tipoProyecto: TIPOS[i % TIPOS.length],
      mensaje: i % 7 === 0 ? "Mensaje largo de prueba. ".repeat(40) : `Mensaje de prueba ${i + 1}`,
      origen: "seed-qa",
      estado: ESTADOS[(i + Math.floor(i / TIPOS.length)) % ESTADOS.length],
    }));
    await Lead.insertMany(docs);
    console.log(`${docs.length} leads de prueba creados`);
  } else {
    console.log("Leads de prueba eliminados");
  }
} finally {
  await mongoose.disconnect();
}