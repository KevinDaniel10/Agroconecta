import Admin from "../models/Admin.js";
import generarJWT from "../helpers/crearJWT.js";

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ msg: "Administrador no registrado" });

  const isMatch = await admin.matchPassword(password);
  if (!isMatch) return res.status(401).json({ msg: "Contraseña incorrecta" });

  const token = generarJWT(admin._id, "admin");

  res.json({
    token,
    rol: "admin",
    email: admin.email
  });
};

const perfilAdmin = (req, res) => {
  if (!req.admin) {
    return res.status(403).json({ msg: "Acceso no autorizado" });
  }

  res.json(req.admin);
};


export { loginAdmin, perfilAdmin };
