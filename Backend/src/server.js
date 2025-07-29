// Requerir los módulos
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import Admin from './models/Admin.js';


// Inicializaciones
const app = express();
dotenv.config();

// Resolver __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(morgan('dev'));

// Middlewares
app.use(express.json());

// Exponer carpeta de imágenes públicamente
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));


// Importar rutas activas
import routerClientes from './routers/cliente_routes.js';
import routerProductores from './routers/productor_routes.js';
import routerProductos from './routers/producto_routes.js';
import routersSoporte from './routers/soporte_routes.js';
import adminRoutes from './routers/admin_routes.js'

// Rutas activas
app.use('/api/cliente', routerClientes);
app.use('/api/productor', routerProductores);
app.use('/api/productos', routerProductos);
app.use('/api/soporte', routersSoporte);
app.use("/api/admin",adminRoutes)

// Ruta no encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

//crear admin

const crearAdminPorDefecto = async () => {
  try {
    const existe = await Admin.findOne({ email: "admin@agro.com" });
    if (!existe) {
      const nuevoAdmin = new Admin({
        email: "admin@agro.com",
        password: await new Admin().encrypPassword("admin123"), 
      });
      await nuevoAdmin.save();
      console.log("✅ Admin creado por defecto: admin@agro.com / admin123");
    } else {
      console.log("🔐 Admin por defecto ya existe");
    }
  } catch (error) {
    console.error("❌ Error creando el admin por defecto:", error.message);
  }
};

crearAdminPorDefecto(); // Ejecutar al iniciar el servidor



// Exportar app
export default app;
