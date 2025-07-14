import mongoose from "mongoose";
import Producto from "../models/Producto.js";
import Productor from "../models/Productor.js";

// Ver detalle del producto
const detalleProducto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `Lo sentimos, no existe ese producto` });

    const producto = await Producto.findById(id).populate("productor", "_id nombre");
    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ msg: "Error interno del servidor", error: error.message });
  }
};

// Registrar producto
const registrarProducto = async (req, res) => {
  try {
    const {
      nombre,
      precio,
      stock,
      unidad,
      categoria,
      descripcion,
      productor,
    } = req.body;

    const campos = [nombre, precio, stock, unidad, categoria, descripcion, productor];
    if (campos.some(c => !c || c === ""))
      return res.status(400).json({ msg: "Todos los campos son obligatorios excepto imagen" });

    if (!mongoose.Types.ObjectId.isValid(productor))
      return res.status(400).json({ msg: `El ID del productor no es válido` });

    const nuevoProducto = new Producto({
      nombre,
      precio,
      stock,
      unidad,
      categoria,
      descripcion,
      productor,
      imagen: req.file?.filename ?? ""
    });

    await nuevoProducto.save();
    res.status(201).json({ msg: `Registro exitoso del producto`, producto: nuevoProducto });
  } catch (error) {
    console.error("Error al registrar producto:", error);
    res.status(500).json({ msg: "Error interno del servidor", error: error.message });
  }
};

// Actualizar producto
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `El producto no existe` });

    const producto = await Producto.findById(id);
    if (!producto)
      return res.status(404).json({ msg: "Producto no encontrado para actualizar" });

    const campos = ["nombre", "precio", "stock", "unidad", "categoria", "descripcion"];
    for (let campo of campos) {
      if (!req.body[campo] || req.body[campo] === "")
        return res.status(400).json({ msg: `El campo ${campo} es obligatorio` });
    }

    producto.nombre = req.body.nombre;
    producto.precio = req.body.precio;
    producto.stock = req.body.stock;
    producto.unidad = req.body.unidad;
    producto.categoria = req.body.categoria;
    producto.descripcion = req.body.descripcion;

    if (req.file?.filename) {
      producto.imagen = req.file.filename;
    }

    const productoActualizado = await producto.save();
    res.status(200).json({ msg: "Producto actualizado correctamente", producto: productoActualizado });
  } catch (error) {
    res.status(500).json({ msg: "Error interno del servidor", error: error.message });
  }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `Lo sentimos, no existe ese producto` });

    const productoEliminado = await Producto.findByIdAndDelete(id);
    if (!productoEliminado)
      return res.status(404).json({ msg: "Producto no encontrado para eliminar" });

    res.status(200).json({ msg: "Producto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error interno del servidor", error: error.message });
  }
};

// Cambiar estado
const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `Lo sentimos, no existe ese producto` });

    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });
    if (!producto) return res.status(404).json({ msg: "Producto no encontrado" });

    res.status(200).json({ msg: "Estado del producto modificado exitosamente", producto });
  } catch (error) {
    res.status(500).json({ msg: "Error interno del servidor", error: error.message });
  }
};

// Listar productos del productor autenticado
const listarProductosPorProductor = async (req, res) => {
  try {
    const productos = await Producto.find({ productor: req.usuario._id });
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ msg: "Error al listar productos", error: error.message });
  }
};

// ✅ Corregido aquí
const obtenerProductosDisponibles = async (req, res) => {
  try {
    const productos = await Producto.find({
      stock: { $gt: 0 },
      estado: true
    }).populate("productor", "nombre");

    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos disponibles:", error);
    res.status(500).json({ msg: "Error al obtener productos disponibles", error: error.message });
  }
};

export {
  detalleProducto,
  registrarProducto,
  actualizarProducto,
  eliminarProducto,
  cambiarEstado,
  listarProductosPorProductor,
  obtenerProductosDisponibles
};
