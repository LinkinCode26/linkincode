import 'dotenv/config';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import request from "supertest";
import app from "../app.js";
import * as leadsService from "../services/leads.service.js";
import * as emailService from "../services/emailService.js";
import { connectDB } from '../config/db.js';

beforeAll(async () => {
  await connectDB();
});

// Mockeamos el envío de emails por defecto en todos los tests para evitar conexiones reales
beforeEach(() => {
  jest.spyOn(emailService, "sendLeadNotificationToTeam").mockResolvedValue({ messageId: "mock-team-id" });
  jest.spyOn(emailService, "sendLeadAutoReply").mockResolvedValue({ messageId: "mock-reply-id" });
});

afterEach(() => {
  jest.restoreAllMocks();
});

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
    jest.spyOn(leadsService, "createLead").mockRejectedValue(new Error("Mongo caído"));

    const response = await request(app).post("/api/leads").send({
      nombre: "Juan Perez",
      email: "juan@ejemplo.com",
      tipoProyecto: "Landing Page",
      mensaje: "Quiero una landing page",
    });
    expect(response.status).toBe(500);
    expect(response.body.status).toBe("error");
  });

  it("responde 201 y guarda el lead aunque el envío de emails falle (criterio de resiliencia)", async () => {
    // Sobrescribimos el mock únicamente para este test, simulando caída del SMTP
    jest.spyOn(emailService, "sendLeadNotificationToTeam").mockRejectedValue(new Error("SMTP Connection Failed"));
    jest.spyOn(emailService, "sendLeadAutoReply").mockRejectedValue(new Error("SMTP Auth Timeout"));

    const response = await request(app).post("/api/leads").send({
      nombre: "Carlos Resiliente",
      email: "carlos.resiliente@ejemplo.com",
      tipoProyecto: "Desarrollo Web",
      mensaje: "Probando tolerancia a fallos de correo",
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("ok");
    expect(response.body.lead).toBeDefined();
    expect(response.body.lead.nombre).toBe("Carlos Resiliente");
  });
});