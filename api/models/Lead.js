import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    tipoProyecto: {
      type: String,
      required: true,
    },
    mensaje: {
      type: String,
      required: true,
      trim: true,
    },
    origen: {
      type: String,
      default: "",
    },
    estado: {
      type: String,
      enum: ["nuevo", "contactado", "ganado", "perdido"],
      default: "nuevo",
    },
  },
  {
    timestamps: true,
  },
);

leadSchema.index({ email: 1 });
leadSchema.index({ estado: 1 });

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
