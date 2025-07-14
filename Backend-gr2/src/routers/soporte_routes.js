import express from "express";
import { enviarMensaje } from "../controllers/soporte_controller.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";

const router = express.Router();

router.post("/soporte", verificarAutenticacion, enviarMensaje);

export default router;
