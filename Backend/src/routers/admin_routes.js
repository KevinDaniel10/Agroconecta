import express from "express";
import { loginAdmin, perfilAdmin } from "../controllers/admin_controller.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/perfil", verificarAutenticacion, perfilAdmin);

export default router;
