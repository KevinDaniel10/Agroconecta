import jwt from 'jsonwebtoken';
import Productor from '../models/Productor.js';
import Cliente from '../models/Cliente.js';

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
    } else if (rol === "cliente") {
      usuario = await Cliente.findById(id).select("-password");
      if (!usuario) return res.status(404).json({ msg: "Cliente no encontrado" });
    } else {
      return res.status(403).json({ msg: "Rol no autorizado" });
    }

    // Unificación y compatibilidad
    usuario.rol = rol;
    req.usuario = usuario;
    req.productorBDD = rol === 'productor' ? usuario : undefined;
    req.clienteBDD = rol === 'cliente' ? usuario : undefined;

    console.log("Autenticado:", {
      rol: usuario.rol,
      id: usuario._id,
      nombre: usuario.nombre
    });

    next();

  } catch (error) {
    console.error("Error autenticando:", error.message);
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
};

export default verificarAutenticacion;
