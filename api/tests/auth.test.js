import "dotenv/config";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import User from "../models/User.js";
import { startTestDB, stopTestDB, clearTestDB } from "./helpers/testDb.js";

let ip = 1;
const post = (path, body, token) => {
  const r = request(app).post(path).set("X-Forwarded-For", `10.1.0.${ip++}`);
  if (token) r.set("Authorization", `Bearer ${token}`);
  return r.send(body);
};

const expiredToken = (id) =>
  jwt.sign({ id, exp: Math.floor(Date.now() / 1000) - 10 }, process.env.JWT_SECRET);

beforeAll(async () => {
  process.env.JWT_SECRET ||= "secreto_de_prueba";
  await startTestDB();
}, 60_000);
afterAll(stopTestDB);
beforeEach(clearTestDB);

describe("auth", () => {
  it("register sin token responde 401", async () => {
    const res = await post("/api/auth/register", { email: "x@x.com", password: "123456" });
    expect(res.status).toBe(401);
    expect(await User.countDocuments()).toBe(0);
  });

  it("register con token de admin crea el usuario", async () => {
    const admin = await User.create({ email: "admin@test.com", password: "secret123" });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    const res = await post("/api/auth/register", { email: "otro@test.com", password: "secret123" }, token);
    expect(res.status).toBe(201);
  });

  it("login correcto devuelve token", async () => {
    await User.create({ email: "admin@test.com", password: "secret123" });
    const res = await post("/api/auth/login", { email: "admin@test.com", password: "secret123" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("login con password incorrecta responde 401", async () => {
    await User.create({ email: "admin@test.com", password: "secret123" });
    const res = await post("/api/auth/login", { email: "admin@test.com", password: "mala" });
    expect(res.status).toBe(401);
  });

  it("login sin password responde 400 (no 500)", async () => {
    const res = await post("/api/auth/login", { email: "admin@test.com" });
    expect(res.status).toBe(400);
  });

  it("login con email como objeto responde 400", async () => {
    const res = await post("/api/auth/login", { email: { $ne: null }, password: "x" });
    expect(res.status).toBe(400);
  });
});

it("token vencido responde 401", async () => {
  const u = await User.create({ email: "a@test.com", password: "secret123" });
  const res = await request(app).get("/api/auth/me")
    .set("X-Forwarded-For", "10.8.0.1").set("Authorization", `Bearer ${expiredToken(u._id)}`);
  expect(res.status).toBe(401);
  expect(res.body.message).toMatch(/inválido o expirado/i);
});

it("token de un usuario borrado responde 401", async () => {
  const u = await User.create({ email: "a@test.com", password: "secret123" });
  const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET);
  await User.deleteOne({ _id: u._id });
  const res = await request(app).get("/api/auth/me")
    .set("X-Forwarded-For", "10.8.0.2").set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(401);
});

it("bloquea el 6° login fallido de una IP con 429", async () => {
  const attempt = () => request(app).post("/api/auth/login")
    .set("X-Forwarded-For", "10.9.9.9").send({ email: "a@a.com", password: "mala" });
  for (let i = 0; i < 5; i++) expect((await attempt()).status).toBe(401);
  expect((await attempt()).status).toBe(429);
});

it("JSON mal formado responde 400 (no 500)", async () => {
  const res = await request(app).post("/api/auth/login")
    .set("X-Forwarded-For", "10.8.0.3").set("Content-Type", "application/json").send('{"email":');
  expect(res.status).toBe(400);
});