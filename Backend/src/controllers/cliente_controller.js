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
    
  // Activar sesión global
    clienteBDD.sesionActiva = true;
    await clienteBDD.save();

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
import nodemailer from "nodemailer";

const confirmarCompra = async (req, res) => {
  const { productos } = req.body;

  try {
    const cliente = await Cliente.findById(req.usuario._id);
    if (!cliente) return res.status(404).json({ msg: "Cliente no encontrado" });

    let totalCompra = 0;
    let detallesFactura = [];

    for (const item of productos) {
      const producto = await Producto.findById(item.productoId).populate("productor");
      if (!producto) return res.status(404).json({ msg: `Producto con ID ${item.productoId} no encontrado.` });

      if (producto.stock < item.cantidad) {
        return res.status(400).json({ msg: `Stock insuficiente para ${producto.nombre}` });
      }

      // Restar stock
      producto.stock -= item.cantidad;
      await producto.save();

      const subtotal = item.cantidad * producto.precio;
      totalCompra += subtotal;

      // Guardar detalle para factura
      detallesFactura.push({
        nombre: producto.nombre,
        cantidad: item.cantidad,
        precio: producto.precio,
        subtotal,
      });

      // Registrar historial de compra del cliente
      cliente.historialCompras.push({
        producto: producto._id,
        nombreProducto: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
      });

      // Registrar historial de ventas del productor
      const productor = await Productor.findById(producto.productor._id);
      productor.historialVentas.push({
        producto: producto._id,
        cliente: cliente._id,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
        total: subtotal,
      });
      await productor.save();
    }

    cliente.compra = [];
    await cliente.save();

    // 🧾 Enviar factura por correo
    const htmlFactura = `
      <h2>Factura de Compra - Agroconecta</h2>
      <p>Gracias por tu compra, ${cliente.nombre} ${cliente.apellido}</p>
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr>
        </thead>
        <tbody>
          ${detallesFactura.map(p => `
            <tr>
              <td>${p.nombre}</td>
              <td>${p.cantidad}</td>
              <td>$${p.precio.toFixed(2)}</td>
              <td>$${p.subtotal.toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <p><strong>Total: $${totalCompra.toFixed(2)}</strong></p>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.PASS_GMAIL,
      },
    });

    await transporter.sendMail({
      from: '"Agroconecta" <no-reply@agro.com>',
      to: cliente.email,
      subject: "Tu factura de compra",
      html: htmlFactura,
    });

    res.json({ msg: "✅ Compra confirmada y factura enviada al correo." });

  } catch (error) {
    console.error("❌ ERROR AL CONFIRMAR COMPRA:", error.message);
    res.status(500).json({ msg: "Error interno al confirmar la compra.", error: error.message });
  }
};


const obtenerHistorial = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.usuario._id).populate("historialCompras.producto", "nombre categoria");
    res.status(200).json(cliente.historialCompras);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener historial de compras", error: error.message });
  }
};
const logout = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.usuario._id);
    if (!cliente) return res.status(404).json({ msg: "Cliente no encontrado" });

    cliente.sesionActiva = false;
    await cliente.save();

    res.status(200).json({ msg: "Sesión cerrada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al cerrar sesión", error: error.message });
  }
};

const getTopClientes = async (req, res) => {
  try {
    const top = await Cliente.aggregate([
      {
        $addFields: {
          totalCompras: { $size: { $ifNull: ["$historialCompras", []] } }
        }
      },
      { $sort: { totalCompras: -1 } },
      { $limit: 5 },
      {
        $project: {
          nombre: 1,
          apellido: 1,
          totalCompras: 1
        }
      }
    ]);

    res.json(top);
  } catch (error) {
    console.error("Error al obtener top clientes:", error);
    res.status(500).json({ error: "Error al obtener top clientes" });
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
    confirmarCompra,
    obtenerHistorial,
    logout,
    getTopClientes
}
