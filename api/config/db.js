import mongoose from "mongoose";

mongoose.set("strictQuery", true);

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Falta la variable de entorno MONGODB_URI");
  }

  mongoose.connection.on("connected", () => {
    console.log("MongoDB conectado");
  });

  mongoose.connection.on("error", (err) => {
    console.error("Error de conexion a MongoDB:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB desconectado");
  });

  await mongoose.connect(uri);
}

export default connectDB;