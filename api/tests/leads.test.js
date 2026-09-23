import 'dotenv/config';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import request from "supertest";
import app from "../app.js";
import * as leadsService from "../services/leads.service.js";
import { connectDB } from '../config/db.js';

// Conecta a Mongo una sola vez, antes de correr todos los tests del archivo
beforeAll(async () => {
  await connectDB();
});

// Cierra la conexión al terminar, para que Jest no quede colgado esperando
afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/leads", () => {
  it("crea un lead y responde 201 cuando el body es válido", async () => {
    const response = await request(app).post("/api/leads").send({
      nombre: "Juan Perez",
      email: "juan@ejemplo.com",
      tipoProyecto: "Landing Page",
      mensaje: "Quiero una landing page",
    });
    expect(response.status).toBe(201);
    expect(response.body.status).toBe("ok");
    expect(response.body.lead.nombre).toBe("Juan Perez");
  });

  it("responde 400 cuando falta un campo requerido", async () => {
    const response = await request(app).post("/api/leads").send({
      nombre: "Juan Perez",
    });
    expect(response.status).toBe(400);
    expect(response.body.status).toBe("error");
    expect(response.body.errors).toHaveProperty("email");
  });

  it("responde 500 cuando el service falla", async () => {
    // Simula que createLead falla, sin tocar Mongo de verdad
    jest.spyOn(leadsService, "createLead").mockRejectedValue(new Error("Mongo caído"));

    const response = await request(app).post("/api/leads").send({
      nombre: "Juan Perez",
      email: "juan@ejemplo.com",
      tipoProyecto: "Landing Page",
      mensaje: "Quiero una landing page",
    });
    expect(response.status).toBe(500);
    expect(response.body.status).toBe("error");

    // Restaura createLead a su comportamiento real para los próximos tests
    leadsService.createLead.mockRestore();
  });
});