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
  confirmarCompra
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
router.post("/confirmar-compra", verificarAutenticacion, confirmarCompra);

// 🔄 Recuperación de cuenta
router.post("/recuperar-password", recuperarPassword);            // Enviar correo
router.get("/comprobar-token/:token", comprobarTokenPasword);     // Validar token
router.post("/nuevo-password/:token", nuevoPassword);             // Guardar nueva contraseña

// 🛠️ Rutas administrativas (opcional)
router.get("/clientes", verificarAutenticacion, listarClientes);
router.get("/:id", verificarAutenticacion, detalleCliente);

export default router;
