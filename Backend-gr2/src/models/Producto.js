import mongoose, { Schema, model } from "mongoose";

const productoSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    precio: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 1 },
    unidad: {
      type: String,
      enum: [
        "Kilogramo (kg)",
        "Gramo (g)",
        "Litro (l)",
        "Mililitro (ml)",
        "Unidad",
        "Paquete"
      ],
      required: true
    },
    categoria: {
      type: String,
      enum: ["Verduras", "Frutas", "Lácteos", "Carnes", "Granos", "Otros"],
      required: true
    },
    imagen: { type: String, default: "" },
    estado: { type: Boolean, default: true },
    productor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Productores", // Asegúrate que coincida con el modelo exportado
      required: true
    }
  },
  { timestamps: true }
);

export default model("Producto", productoSchema);
