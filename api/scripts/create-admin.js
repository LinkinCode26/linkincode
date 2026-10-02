import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("Uso: npm run create-admin -- <email> <password>");
  process.exit(1);
}

try {
  await connectDB();
  if (await User.findOne({ email: email.toLowerCase() })) {
    console.log("Ese usuario ya existe.");
  } else {
    await User.create({ email, password });
    console.log(`Admin creado: ${email}`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}