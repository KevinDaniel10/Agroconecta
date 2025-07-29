import { Router } from "express";
const router = Router();

import {
  registro,
  confirmEmail,
  login,
  perfil,
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
} from "../controllers/cliente_controller.js";

import verificarAutenticacion from "../middlewares/autenticacion.js";
import { validacionProductor } from "../middlewares/validacionProductor.js";

// 🔓 Rutas públicas
router.post("/registro", validacionProductor, registro); // Registro
router.get("/confirmar/:token", confirmEmail);           // Confirmar email
router.post("/login", login);                             // Login

// 🔐 Rutas privadas (requieren token)
router.get("/perfil", verificarAutenticacion, perfil);
router.put("/actualizar/:id", verificarAutenticacion, actualizarPerfil);
router.put("/password", verificarAutenticacion, actualizarPassword);
router.post('/carrito', verificarAutenticacion, agregarAlCarrito);
router.get('/top', verificarAutenticacion, getTopClientes);
router.get("/historial", verificarAutenticacion, obtenerHistorial);
router.post("/confirmar-compra", verificarAutenticacion, confirmarCompra);
router.post('/logout', verificarAutenticacion, logout);


// 🔄 Recuperación de cuenta
router.post("/recuperar-password", recuperarPassword);            // Enviar correo
router.get("/comprobar-token/:token", comprobarTokenPasword);     // Validar token
router.post("/nuevo-password/:token", nuevoPassword);             // Guardar nueva contraseña

// 🛠️ Rutas administrativas (opcional)
router.get("/clientes", listarClientes);
router.get("/:id", verificarAutenticacion, detalleCliente);

export default router;
