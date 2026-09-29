import request from "supertest";
import app from "../app.js";
import Lead from "../models/Lead.js";
import { startTestDB, stopTestDB, clearTestDB } from "./helpers/testDb.js";

// Cada request sale con una IP distinta (X-Forwarded-For, válido porque la app
// usa `trust proxy`). Si no, todos los tests compartirían el contador del
// rate limiter y el sexto envío del archivo devolvería 429.
let ipCounter = 1;
const nextIp = () => `10.0.0.${ipCounter++}`;

const postLead = (body, ip = nextIp()) =>
  request(app).post("/api/leads").set("X-Forwarded-For", ip).send(body);

const validLead = (overrides = {}) => ({
  nombre: "Juan Pérez",
  email: "juan@ejemplo.com",
  tipoProyecto: "Landing Pages",
  mensaje: "Necesito una landing page para mi negocio.",
  ...overrides,
});

beforeAll(startTestDB, 60_000);
afterAll(stopTestDB);
beforeEach(clearTestDB);

describe("Flujo de contacto: POST /api/leads", () => {
  describe("envío válido", () => {
    it("responde 201 y persiste el lead con estado 'nuevo'", async () => {
      const res = await postLead(validLead());

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("ok");
      expect(res.body.lead).toMatchObject({
        nombre: "Juan Pérez",
        email: "juan@ejemplo.com",
        tipoProyecto: "Landing Pages",
      });

      const saved = await Lead.find({});
      expect(saved).toHaveLength(1);
      expect(saved[0].estado).toBe("nuevo");
    });
  });

  describe("datos faltantes o inválidos", () => {
    it.each(["nombre", "email", "tipoProyecto", "mensaje"])(
      "responde 400 y no guarda nada cuando falta %s",
      async (field) => {
        const payload = validLead();
        delete payload[field];

        const res = await postLead(payload);

        expect(res.status).toBe(400);
        expect(res.body.status).toBe("error");
        expect(res.body.errors).toHaveProperty(field);
        expect(await Lead.countDocuments()).toBe(0);
      },
    );

    it("responde 400 cuando el email no tiene formato válido", async () => {
      const res = await postLead(validLead({ email: "esto-no-es-un-email" }));

      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveProperty("email");
      expect(await Lead.countDocuments()).toBe(0);
    });
  });

  describe("spam bloqueado por rate limit", () => {
    it("acepta 5 envíos por IP y bloquea el 6° con 429 sin guardarlo", async () => {
      const spammerIp = nextIp();

      for (let i = 1; i <= 5; i++) {
        const res = await postLead(
          validLead({ email: `lead${i}@ejemplo.com` }),
          spammerIp,
        );
        expect(res.status).toBe(201);
      }

      const blocked = await postLead(
        validLead({ email: "spam@ejemplo.com" }),
        spammerIp,
      );

      expect(blocked.status).toBe(429);
      expect(blocked.body.status).toBe("error");
      expect(blocked.body.message).toMatch(/demasiados envíos/i);

      expect(await Lead.countDocuments()).toBe(5);
      expect(await Lead.exists({ email: "spam@ejemplo.com" })).toBeNull();
    });

    it("el límite es por IP: otra IP puede seguir enviando", async () => {
      const spammerIp = nextIp();
      for (let i = 0; i < 5; i++) {
        await postLead(validLead(), spammerIp);
      }
      expect((await postLead(validLead(), spammerIp)).status).toBe(429);

      const res = await postLead(validLead(), nextIp());
      expect(res.status).toBe(201);
    });
  });
});