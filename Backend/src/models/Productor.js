import { Schema, model } from 'mongoose';
import bcrypt from "bcryptjs";

const productorSchema = new Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  direccion: { type: String, trim: true, default: null },
  telefono: { type: Number, trim: true, default: null },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  status: { type: Boolean, default: true },
  token: { type: String, default: null },
  confirmEmail: { type: Boolean, default: false },
  sesionActiva: {
  type: Boolean,
  default: false,
},
  historialVentas: [
  {
    producto: {
      type: Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    cliente: {
      type: Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
    },
    precioUnitario: {
      type: Number,
      required: true,
    },
    
    fecha: {
      type: Date,
      default: Date.now,
    },
  }
],
}, {
  timestamps: true
});

productorSchema.methods.encrypPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

productorSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

productorSchema.methods.crearToken = function() {
  return this.token = Math.random().toString(36).slice(2);
};

export default model("Productores", productorSchema);
