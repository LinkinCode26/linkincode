import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDB } from "../../config/db.js";

let mongod;

// Levanta una Mongo en memoria y conecta con el mismo connectDB() de producción.
export async function startTestDB() {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  await connectDB();
}

export async function stopTestDB() {
  await mongoose.disconnect();
  await mongod?.stop();
}

// Vacía todas las colecciones entre tests.
export async function clearTestDB() {
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({})),
  );
}