import express from "express";
import {
  enviarMensaje,
  obtenerMensajes,
  marcarComoLeido,
  marcarComoSolucionado,
  responderMensaje
} from "../controllers/soporte_controller.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";

const router = express.Router();

router.post("/soporte", verificarAutenticacion, enviarMensaje);
router.get("/soporte", verificarAutenticacion, obtenerMensajes); // Admin
router.patch("/soporte/:id/leido", verificarAutenticacion, marcarComoLeido); // Admin
router.patch("/soporte/:id/solucionado", verificarAutenticacion, marcarComoSolucionado);
router.patch("/soporte/:id/responder", verificarAutenticacion, responderMensaje);


export default router;
