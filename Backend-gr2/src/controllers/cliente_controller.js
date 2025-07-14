// IMPORTAR DEPENDENCIAS Y MODELOS
import Cliente from "../models/Cliente.js"
import Productor from "../models/Productor.js"
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose"
import Producto from "../models/Producto.js";


// LOGIN
const login = async (req, res) => {
    const { email, password } = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    const clienteBDD = await Cliente.findOne({ email }).select("-__v -createdAt -updatedAt")
    if (!clienteBDD) return res.status(404).json({ msg: "Usuario no registrado" })
    if (!clienteBDD.confirmEmail) return res.status(403).json({ msg: "Debes confirmar tu cuenta antes de iniciar sesión" })

    const verificarPassword = await clienteBDD.matchPassword(password)
    if (!verificarPassword) return res.status(401).json({ msg: "Contraseña incorrecta" })

    const token = generarJWT(clienteBDD._id, "cliente")
    const { nombre, apellido, direccion, telefono, _id } = clienteBDD

    res.status(200).json({
        token,
        nombre,
        apellido,
        direccion,
        telefono,
        email: clienteBDD.email,
        rol: "cliente",
        _id
    })
}

// PERFIL
const perfil = (req, res) => {
    const { password, __v, createdAt, updatedAt, token, confirmEmail, ...clienteData } = req.clienteBDD._doc
    res.status(200).json(clienteData)
}

// REGISTRO
const registro = async (req, res) => {
    const { email, password } = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Todos los campos son obligatorios" })

    const verificarCliente = await Cliente.findOne({ email })
    const verificarProductor = await Productor.findOne({ email })
    if (verificarCliente || verificarProductor) return res.status(400).json({ msg: "El email ya está registrado" })

    const nuevoCliente = new Cliente(req.body)
    nuevoCliente.password = await nuevoCliente.encrypPassword(password)
    const token = nuevoCliente.crearToken()
    nuevoCliente.token = token

    await sendMailToUser(email, token)
    await nuevoCliente.save()

    res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" })
}

// CONFIRMAR EMAIL
const confirmEmail = async (req, res) => {
    const { token } = req.params
    if (!token) return res.status(400).json({ msg: "Token no válido" })

    const clienteBDD = await Cliente.findOne({ token })
    if (!clienteBDD) return res.status(404).json({ msg: "Token inválido o cuenta ya confirmada" })

    clienteBDD.token = null
    clienteBDD.confirmEmail = true
    await clienteBDD.save()

    res.status(200).json({ msg: "Cuenta confirmada correctamente, ya puedes iniciar sesión" })
}

// LISTAR
const listarClientes = async (req, res) => {
    const clientes = await Cliente.find({ estado: true }).select("-password -__v -createdAt -updatedAt")
    res.status(200).json(clientes)
}

// DETALLE
const detalleCliente = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `ID inválido: ${id}` })

    const cliente = await Cliente.findById(id).select("-password -__v -createdAt -updatedAt")
    if (!cliente) return res.status(404).json({ msg: "Cliente no encontrado" })

    res.status(200).json(cliente)
}

// ACTUALIZAR PERFIL
const actualizarPerfil = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "ID inválido" })
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Todos los campos son obligatorios" })

    const clienteBDD = await Cliente.findById(id)
    if (!clienteBDD) return res.status(404).json({ msg: `No existe el cliente ${id}` })

    if (clienteBDD.email !== req.body.email) {
        const existeCliente = await Cliente.findOne({ email: req.body.email })
        const existeProductor = await Productor.findOne({ email: req.body.email })
        if (existeCliente || existeProductor) return res.status(400).json({ msg: "El nuevo email ya está en uso" })
    }

    clienteBDD.nombre = req.body.nombre || clienteBDD.nombre
    clienteBDD.apellido = req.body.apellido || clienteBDD.apellido
    clienteBDD.direccion = req.body.direccion || clienteBDD.direccion
    clienteBDD.telefono = req.body.telefono || clienteBDD.telefono
    clienteBDD.email = req.body.email || clienteBDD.email

    await clienteBDD.save()
    res.status(200).json({ msg: "Perfil actualizado correctamente" })
}

// ACTUALIZAR PASSWORD
const actualizarPassword = async (req, res) => {
    const clienteBDD = await Cliente.findById(req.clienteBDD._id)
    if (!clienteBDD) return res.status(404).json({ msg: "Cliente no encontrado" })

    const verificarPassword = await clienteBDD.matchPassword(req.body.passwordactual)
    if (!verificarPassword) return res.status(401).json({ msg: "La contraseña actual es incorrecta" })

    clienteBDD.password = await clienteBDD.encrypPassword(req.body.passwordnuevo)
    await clienteBDD.save()

    res.status(200).json({ msg: "Contraseña actualizada correctamente" })
}

// RECUPERAR PASSWORD
const recuperarPassword = async (req, res) => {
    const { email } = req.body
    if (!email) return res.status(400).json({ msg: "El campo email es obligatorio" })

    const clienteBDD = await Cliente.findOne({ email })
    if (!clienteBDD) return res.status(404).json({ msg: "El cliente no está registrado" })

    const token = clienteBDD.crearToken()
    clienteBDD.token = token

    await sendMailToRecoveryPassword(email, token,"cliente")
    await clienteBDD.save()

    res.status(200).json({ msg: "Revisa tu correo para reestablecer la contraseña" })
}

// COMPROBAR TOKEN
const comprobarTokenPasword = async (req, res) => {
    const { token } = req.params
    const clienteBDD = await Cliente.findOne({ token })
    if (!clienteBDD) return res.status(404).json({ msg: "Token no válido o expirado" })

    res.status(200).json({ msg: "Token válido. Puedes crear nueva contraseña." })
}

// NUEVO PASSWORD
const nuevoPassword = async (req, res) => {
    const { password, confirmpassword } = req.body
    if (!password || !confirmpassword) return res.status(400).json({ msg: "Todos los campos son obligatorios" })
    if (password !== confirmpassword) return res.status(400).json({ msg: "Las contraseñas no coinciden" })

    const clienteBDD = await Cliente.findOne({ token: req.params.token })
    if (!clienteBDD) return res.status(404).json({ msg: "Token no válido o expirado" })

    clienteBDD.token = null
    clienteBDD.password = await clienteBDD.encrypPassword(password)
    await clienteBDD.save()

    res.status(200).json({ msg: "Contraseña actualizada correctamente. Ya puedes iniciar sesión." })
}
const agregarAlCarrito = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.usuario._id);
    const { productoId, cantidad } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productoId)) {
      return res.status(400).json({ msg: 'ID de producto no válido' });
    }

    const producto = await Producto.findById(productoId);
    if (!producto || !producto.estado || producto.stock < cantidad) {
      return res.status(404).json({ msg: 'Producto no disponible o stock insuficiente' });
    }

    // Ver si el producto ya está en el carrito
    const itemExistente = cliente.compra.find((item) => item.producto.equals(productoId));
    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      cliente.compra.push({ producto: productoId, cantidad });
    }

    await cliente.save();
    res.status(200).json({ msg: 'Producto agregado al carrito' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al agregar producto al carrito', error: error.message });
  }
};
const confirmarCompra = async (req, res) => {
  const { productos } = req.body;

  try {
    for (const item of productos) {
      const producto = await Producto.findById(item.productoId);

      if (!producto) {
        return res.status(404).json({ msg: "Producto no encontrado." });
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({ msg: `Stock insuficiente para ${producto.nombre}` });
      }

      producto.stock -= item.cantidad;
      await producto.save();
    }

    res.json({ msg: "Compra confirmada y stock actualizado." });
  } catch (error) {
    console.error("Error al confirmar compra:", error);
    res.status(500).json({ msg: "Error interno al confirmar la compra." });
  }
};

// EXPORTAR
export {
    login,
    perfil,
    registro,
    confirmEmail,
    listarClientes,
    detalleCliente,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    agregarAlCarrito,
    confirmarCompra
}
