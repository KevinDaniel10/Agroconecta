import { Router } from "express";
import {
  registrarProducto,
  actualizarProducto,
  eliminarProducto,
  cambiarEstado,
  detalleProducto,
  listarProductosPorProductor,
  obtenerProductosDisponibles,
  reducirStock
} from "../controllers/producto_controller.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";
import subirImagen from "../middlewares/subirImagen.js";

const router = Router();

// ✅ Esta es la nueva ruta que necesitas para "Mis Productos"
router.get("/mis-productos", verificarAutenticacion, listarProductosPorProductor);
router.get("/disponibles", verificarAutenticacion, obtenerProductosDisponibles);
router.put("/reducir-stock/:id", verificarAutenticacion, reducirStock);

router.post("/registro", verificarAutenticacion, subirImagen.single("imagen"), registrarProducto);
router.put("/actualizar/:id", verificarAutenticacion, subirImagen.single("imagen"), actualizarProducto);
router.delete("/eliminar/:id", verificarAutenticacion, eliminarProducto);
router.get("/:id", verificarAutenticacion, detalleProducto);
router.put("/cambiar-estado/:id", verificarAutenticacion, cambiarEstado);


export default router;
