// Requerir los módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'

// Importar solo las rutas activas
import routerClientes from './routers/cliente_routes.js'
import routerProductores from './routers/productor_routes.js'
import routerProductos from './routers/producto_routes.js'
import routers from "./routers/soporte_routes.js";
// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
app.set('port', process.env.port || 3000)
app.use(cors())
app.use(morgan('dev'))

// Middlewares 
app.use(express.json())

// Rutas activas
app.use('/api/cliente', routerClientes)
app.use('/api/productor', routerProductores)
app.use('/api/productos', routerProductos)
app.use('/api/soporte', routers)

// Ruta no encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"))

// Exportar app
export default app
