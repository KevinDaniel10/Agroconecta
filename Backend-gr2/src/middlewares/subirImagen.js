import multer from "multer";
import path from "path";
import fs from "fs";

// Asegura que la carpeta uploads exista
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Carpeta donde se guardan las imágenes
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// Filtro de tipos de imagen válidos
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|webp/;
  const esExtensionValida = tiposPermitidos.test(
    path.extname(file.originalname).toLowerCase()
  );
  const esMimeValido = tiposPermitidos.test(file.mimetype);

  if (esExtensionValida && esMimeValido) {
    cb(null, true);
  } else {
    cb(new Error("Formato no válido. Solo se permiten .jpg, .jpeg, .png, .webp"));
  }
};

// Configurar el middleware
const subirImagen = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // máximo 5MB
  fileFilter,
});

export default subirImagen;
