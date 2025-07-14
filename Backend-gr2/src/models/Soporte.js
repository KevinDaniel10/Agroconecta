import mongoose from "mongoose";

const soporteSchema = new mongoose.Schema(
  {
    mensaje: {
      type: String,
      required: true,
      trim: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "rol", // puede ser Cliente o Productor en el futuro
      required: true,
    },
    rol: {
      type: String,
      enum: ["cliente", "productor"],
      required: true,
    },
    leido: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Soporte = mongoose.model("Soporte", soporteSchema);
export default Soporte;
