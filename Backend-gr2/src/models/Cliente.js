import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // ✅ necesario para crear el token

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
}, {
    timestamps: true
});

// Método para cifrar el password del cliente
clienteSchema.methods.encrypPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Método para verificar el password
clienteSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// ✅ Método para generar un token de confirmación
clienteSchema.methods.crearToken = function () {
    return crypto.randomBytes(20).toString("hex");
};

export default model('Cliente', clienteSchema);
