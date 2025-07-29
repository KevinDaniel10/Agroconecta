import jwt from 'jsonwebtoken';
import Productor from '../models/Productor.js';
import Cliente from '../models/Cliente.js';
import Admin from "../models/Admin.js";

const verificarAutenticacion = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ msg: "Lo sentimos, debes proporcionar un token" });
  }

  const { authorization } = req.headers;

  try {
    const token = authorization.split(' ')[1];
    const { id, rol } = jwt.verify(token, process.env.JWT_SECRET);

    let usuario;

    if (rol === "productor") {
      usuario = await Productor.findById(id).select("-password");
      if (!usuario) return res.status(404).json({ msg: "Productor no encontrado" });

      if (!usuario.sesionActiva) {
        return res.status(401).json({ msg: "Sesión inactiva. Debes volver a iniciar sesión." });
      }

      req.productorBDD = usuario;
    } 
    
    else if (rol === "cliente") {
      usuario = await Cliente.findById(id).select("-password");
      if (!usuario) return res.status(404).json({ msg: "Cliente no encontrado" });

      if (!usuario.sesionActiva) {
        return res.status(401).json({ msg: "Sesión inactiva. Debes volver a iniciar sesión." });
      }

      req.clienteBDD = usuario;
    } 
    
    else if (rol === "admin") {
      usuario = await Admin.findById(id).select("-password");
      if (!usuario) return res.status(404).json({ msg: "Admin no encontrado" });

      req.admin = usuario; // ✅ ESTA LÍNEA ES CLAVE
    } 
    
    else {
      return res.status(403).json({ msg: "Rol no autorizado" });
    }

    usuario.rol = rol;
    req.usuario = usuario;

    console.log("✅ Autenticado:", {
      rol: usuario.rol,
      id: usuario._id,
      nombre: usuario.nombre
    });

    next();

  } catch (error) {
    console.error("❌ Error autenticando:", error.message);
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
};

export default verificarAutenticacion;
