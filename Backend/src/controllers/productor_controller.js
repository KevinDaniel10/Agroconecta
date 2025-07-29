// Importar el modelo y dependencias
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import Productor from "../models/Productor.js"
import mongoose from "mongoose"
import Cliente from "../models/Cliente.js"

// LOGIN
// LOGIN actualizado con sesionActiva
const login = async (req, res) => {
  const { email, password } = req.body;
  if (Object.values(req.body).includes("")) {
    return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
  }

  const productorBDD = await Productor.findOne({ email }).select("-status -__v -token -updatedAt -createdAt");
  if (!productorBDD) return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
  if (productorBDD.confirmEmail === false) return res.status(403).json({ msg: "Lo sentimos, debe verificar su cuenta" });

  const verificarPassword = await productorBDD.matchPassword(password);
  if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, el password no es el correcto" });

  // Activar sesión global
  productorBDD.sesionActiva = true;
  await productorBDD.save();

  const token = generarJWT(productorBDD._id, "productor");
  const { nombre, apellido, direccion, telefono, _id } = productorBDD;

  res.status(200).json({
    token,
    nombre,
    apellido,
    direccion,
    telefono,
    _id,
    email: productorBDD.email,
    rol: "productor"
  });
};
const logout = async (req, res) => {
  try {
    const productor = await Productor.findById(req.usuario._id);
    if (!productor) return res.status(404).json({ msg: "Productor no encontrado" });

    productor.sesionActiva = false;
    await productor.save();

    res.status(200).json({ msg: "Sesión cerrada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al cerrar sesión", error: error.message });
  }
};

const perfil = (req, res) => {
  if (!req.productorBDD) {
    return res.status(403).json({ msg: "Acceso no autorizado o no es un productor" });
  }

  const productor = { ...req.productorBDD._doc }; // Accede a los datos puros de Mongoose

  delete productor.token;
  delete productor.confirmEmail;
  delete productor.createdAt;
  delete productor.updatedAt;
  delete productor.__v;

  res.status(200).json(productor);
};


// REGISTRO con verificación cruzada
const registro = async (req, res) => {
    const { email, password } = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    const verificarProductor = await Productor.findOne({ email })
    const verificarCliente = await Cliente.findOne({ email })
    if (verificarProductor || verificarCliente) return res.status(400).json({ msg: "El email ya está registrado" })

    const nuevoProductor = new Productor(req.body)
    nuevoProductor.password = await nuevoProductor.encrypPassword(password)
    const token = nuevoProductor.crearToken()
    nuevoProductor.token = token

    await sendMailToUser(email, token)
    await nuevoProductor.save()

    res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" })
}

// CONFIRMAR EMAIL
const confirmEmail = async (req, res) => {
    if (!req.params.token) return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" })

    const productorBDD = await Productor.findOne({ token: req.params.token })
    if (!productorBDD?.token) return res.status(404).json({ msg: "La cuenta ya ha sido confirmada" })

    productorBDD.token = null
    productorBDD.confirmEmail = true
    await productorBDD.save()

    res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" })
}

// LISTAR
const listarProductors = async (req, res) => {
  try {
    const productores = await Productor.find({}, "nombre email apellido direccion telefono sesionActiva"); // puedes ajustar los campos
    res.status(200).json(productores);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productores", error: error.message });
  }
};


// DETALLE
const detalleProductor = async (req, res) => {
    const { id } = req.params
    const productorBDD = await Productor.findById(id)
    res.status(200).json(productorBDD)
}

// ACTUALIZAR PERFIL
const actualizarPerfil = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` })
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    const productorBDD = await Productor.findById(id)
    if (!productorBDD) return res.status(404).json({ msg: `Lo sentimos, no existe el productor ${id}` })

    if (productorBDD.email !== req.body.email) {
        const productorBDDMail = await Productor.findOne({ email: req.body.email })
        if (productorBDDMail) return res.status(404).json({ msg: `Lo sentimos, el email ya se encuentra registrado` })
    }

    productorBDD.nombre = req.body.nombre || productorBDD.nombre
    productorBDD.apellido = req.body.apellido || productorBDD.apellido
    productorBDD.direccion = req.body.direccion || productorBDD.direccion
    productorBDD.telefono = req.body.telefono || productorBDD.telefono
    productorBDD.email = req.body.email || productorBDD.email

    await productorBDD.save()
    res.status(200).json({ msg: "Perfil actualizado correctamente" })
}

// ACTUALIZAR PASSWORD
const actualizarPassword = async (req, res) => {
    const productorBDD = await Productor.findById(req.productorBDD._id)
    if (!productorBDD) return res.status(404).json({ msg: `Lo sentimos, no existe el productor` })

    const verificarPassword = await productorBDD.matchPassword(req.body.passwordactual)
    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, el password actual no es el correcto" })

    productorBDD.password = await productorBDD.encrypPassword(req.body.passwordnuevo)
    await productorBDD.save()
    res.status(200).json({ msg: "Password actualizado correctamente" })
}

// RECUPERAR PASSWORD
const recuperarPassword = async (req, res) => {
    const { email } = req.body
    if (!email) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    const productorBDD = await Productor.findOne({ email })
    if (!productorBDD) return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" })

    const token = productorBDD.crearToken()
    productorBDD.token = token

    await sendMailToRecoveryPassword(email, token,"productor")
    await productorBDD.save()

    res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" })
}

// COMPROBAR TOKEN
const comprobarTokenPasword = async (req, res) => {
    const { token } = req.params
    const productorBDD = await Productor.findOne({ token })
    if (!productorBDD) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
    res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nuevo password" })
}

// NUEVO PASSWORD
const nuevoPassword = async (req, res) => {
    const { password, confirmpassword } = req.body
    if (!password || !confirmpassword) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" })
    if (password !== confirmpassword) return res.status(400).json({ msg: "Lo sentimos, los passwords no coinciden" })

    const productorBDD = await Productor.findOne({ token: req.params.token })
    if (!productorBDD) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })

    productorBDD.token = null
    productorBDD.password = await productorBDD.encrypPassword(password)
    await productorBDD.save()
    res.status(200).json({ msg: "Felicitaciones, ya puedes iniciar sesión con tu nuevo password" })
}
const obtenerHistorialVentas = async (req, res) => {
  try {
    const productor = await Productor.findById(req.usuario._id)
      .populate("historialVentas.producto", "nombre categoria")
      .populate("historialVentas.cliente", "nombre apellido email");

    res.status(200).json(productor.historialVentas);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener historial de ventas", error: error.message });
  }
};

const getTopProductores = async (req, res) => {
  try {
    const top = await Productor.aggregate([
      {
        $addFields: {
          totalVentas: { $size: { $ifNull: ["$historialVentas", []] } }
        }
      },
      { $sort: { totalVentas: -1 } },
      { $limit: 5 },
      {
        $project: {
          nombre: 1,
          apellido: 1,
          totalVentas: 1
        }
      }
    ]);

    res.json(top);
  } catch (error) {
    console.error("Error al obtener top productores:", error);
    res.status(500).json({ error: "Error al obtener top productores" });
  }
};
// Metrica 1: Ingresos totales
const obtenerIngresosTotales = async (req, res) => {
  try {
    const result = await Productor.aggregate([
      { $unwind: '$historialVentas' },
      {
        $group: {
          _id: null,
          ingresosTotales: {
            $sum: {
              $multiply: ['$historialVentas.cantidad', '$historialVentas.precioUnitario']
            }
          }
        }
      }
    ]);

    res.json({ ingresosTotales: result[0]?.ingresosTotales || 0 });
  } catch (error) {
    console.error('Error al obtener ingresos totales:', error);
    res.status(500).json({ error: 'Error al obtener ingresos totales' });
  }
};

// Metrica 2: Productos más vendidos
const obtenerProductosMasVendidos = async (req, res) => {
  try {
    const productos = await Productor.aggregate([
      { $unwind: '$historialVentas' },
      {
        $group: {
          _id: '$historialVentas.producto',
          totalVendido: { $sum: '$historialVentas.cantidad' }
        }
      },
      { $sort: { totalVendido: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'productos',
          localField: '_id',
          foreignField: '_id',
          as: 'productoInfo'
        }
      },
      { $unwind: '$productoInfo' },
      {
        $project: {
          nombre: '$productoInfo.nombre',
          totalVendido: 1
        }
      }
    ]);

    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    res.status(500).json({ error: 'Error al obtener productos más vendidos' });
  }
};
// Exportar
export {
    login,
    perfil,
    registro,
    confirmEmail,
    listarProductors,
    detalleProductor,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    obtenerHistorialVentas,
    logout,
    getTopProductores,
    obtenerIngresosTotales,
    obtenerProductosMasVendidos
}
