import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const clienteSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  telefono: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    default: "cliente",
    enum: ["cliente"]
  },
  estado: {
    type: Boolean,
    default: true
  },
  token: {
    type: String,
    default: null
  },
  confirmEmail: {
    type: Boolean,
    default: false
  },
  // Carrito actual
  compra: [
    {
      producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  sesionActiva: {
      type: Boolean,
      default: false,
    },
  // Historial de compras confirmadas
  historialCompras: [
  {
    producto: {
      type: Schema.Types.ObjectId,
      ref: 'Producto',
      required: true,
    },
    nombreProducto: {
      type: String,
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1,
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

// Método para cifrar la contraseña
clienteSchema.methods.encrypPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Verificar contraseña
clienteSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generar token de confirmación
clienteSchema.methods.crearToken = function () {
  return crypto.randomBytes(20).toString("hex");
};

export default model('Cliente', clienteSchema);
