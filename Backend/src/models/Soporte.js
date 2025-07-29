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
      enum: ["Cliente", "Productores"],
      required: true,
    },
    leido: {
      type: Boolean,
      default: false,
    },
    solucionado: {
      type: Boolean,
      default: false,
    },
    respuestas: [
    {
      mensaje: {
        type: String,
        required: true
      },
      fecha: {
        type: Date,
        default: Date.now
      },
      admin: {
        type: String, // Puedes guardar nombre o ID si tienes usuarios admin
        required: true
      }
    }
  ]

  },
  {
    timestamps: true,
  }
);

const Soporte = mongoose.model("Soporte", soporteSchema);
export default Soporte;
