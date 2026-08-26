import 'dotenv/config';
import app from "./app.js"
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 3000

async function start() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (err) {
    console.error("No se pudo iniciar el servidor:", err.message);
    process.exit(1);
  }
}

+start();