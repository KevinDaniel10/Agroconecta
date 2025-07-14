import { Router } from "express";
const router = Router();

import {
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
  nuevoPassword
} from "../controllers/productor_controller.js";

import verificarAutenticacion from "../middlewares/autenticacion.js";
import { validacionProductor } from "../middlewares/validacionProductor.js";
import { validacionCOntrasena } from "../middlewares/validacionContraseña.js";

// 🔓 Rutas públicas
router.post("/login", login);
router.post("/registro", validacionProductor, registro);
router.get("/confirmar/:token", confirmEmail);

// 🔄 Recuperación de cuenta (alinea con cliente)
router.post("/recuperar-password", recuperarPassword);            // Enviar correo
router.get("/comprobar-token/:token", comprobarTokenPasword);     // Validar token
router.post("/nuevo-password/:token", nuevoPassword);             // Guardar nueva contraseña

// 🛠️ Gestión general
router.get("/productors", listarProductors);

// 🔐 Rutas privadas
router.get("/perfil", verificarAutenticacion, perfil);
router.get("/productor/:id", verificarAutenticacion, detalleProductor);
router.put("/actualizar/:id", verificarAutenticacion, actualizarPerfil);
router.put("/productor/actualizarpassword", verificarAutenticacion, validacionCOntrasena, actualizarPassword);

export default router;
