import "dotenv/config";
import mongoose from "mongoose";
import { jest } from "@jest/globals";
import request from "supertest";
import app from "../app.js";
import * as leadsService from "../services/leads.service.js";
import { connectDB } from "../config/db.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

beforeAll(async () => {
  await connectDB();
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
    jest
      .spyOn(leadsService, "createLead")
      .mockRejectedValue(new Error("Mongo caído"));

    const response = await request(app).post("/api/leads").send({
      nombre: "Juan Perez",
      email: "juan@ejemplo.com",
      tipoProyecto: "Landing Page",
      mensaje: "Quiero una landing page",
    });
    expect(response.status).toBe(500);
    expect(response.body.status).toBe("error");

    leadsService.createLead.mockRestore();
  });

  it("descarta silenciosamente cuando el honeypot viene lleno, sin llamar a createLead", async () => {
    const createLeadSpy = jest.spyOn(leadsService, "createLead");

    const response = await request(app).post("/api/leads").send({
      nombre: "Juan Perez",
      email: "juan@ejemplo.com",
      tipoProyecto: "Landing Page",
      mensaje: "Quiero una landing page",
      website: "http://spam.com",
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("ok");
    expect(response.body.lead).toBeUndefined();
    expect(createLeadSpy).not.toHaveBeenCalled();

    createLeadSpy.mockRestore();
  });
});

describe("GET /api/leads", () => {
  let validToken;

  beforeAll(() => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "secreto_de_prueba";
    validToken = jwt.sign({ id: "id_falso_123" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("responde 401 si no se envía el token (sin token)", async () => {
    const response = await request(app).get("/api/leads");

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/falta el token/i);
  });

  it("responde 401 si el token es inválido o expiró", async () => {
    const response = await request(app)
      .get("/api/leads")
      .set("Authorization", "Bearer token_inventado_invalido");

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/inválido o expirado/i);
  });

  it("responde 200 y devuelve los datos de paginación correctos (totalPages/currentPage)", async () => {
    jest.spyOn(User, "findById").mockReturnValue({
      select: jest
        .fn()
        .mockResolvedValue({ _id: "id_falso_123", email: "admin@test.com" }),
    });

    jest.spyOn(leadsService, "getFilteredLeads").mockResolvedValue({
      leads: [{ nombre: "Lead 1" }, { nombre: "Lead 2" }],
      total: 12,
    });

    const response = await request(app)
      .get("/api/leads?page=2&limit=2")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.pagination.currentPage).toBe(2);
    expect(response.body.pagination.pageSize).toBe(2);
    expect(response.body.pagination.totalItems).toBe(12);
    expect(response.body.pagination.totalPages).toBe(6);
  });

  it("responde 200 y aplica correctamente los filtros combinados", async () => {
    jest.spyOn(User, "findById").mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: "id_falso_123" }),
    });

    const getFilteredLeadsSpy = jest
      .spyOn(leadsService, "getFilteredLeads")
      .mockResolvedValue({
        leads: [],
        total: 0,
      });

    const response = await request(app)
      .get("/api/leads?tipoProyecto=web&estado=nuevo")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(getFilteredLeadsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        tipoProyecto: { $regex: "web", $options: "i" },
        estado: "nuevo",
      }),
      0,
      10,
    );
  });
});
