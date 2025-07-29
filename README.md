Agroconecta es un sistema web que permite conectar a pequeños productores con clientes finales. El proyecto cuenta con una interfaz frontend desarrollada en React con Vite y un backend en Node.js con Express, conectado a una base de datos MongoDB Atlas.

Para ejecutar el sistema localmente, se deben seguir los siguientes pasos:

1. Clonar el repositorio desde GitHub.
2. Ingresar a la carpeta del backend (Backend) e instalar las dependencias con "npm install".
3. Crear un archivo ".env" usando como guía el ".env.example", y configurar las variables como la cadena de conexión de MongoDB y la clave secreta JWT.
4. Ejecutar el servidor con "npm run dev".
5. Luego, ingresar a la carpeta del frontend (Frontend), instalar sus dependencias con "npm install", y levantar el proyecto con "npm run dev".

El frontend se ejecutará en http://localhost:5173 y el backend en http://localhost:4000, por defecto.

Este proyecto está desplegado en línea usando Vercel (para el frontend) y Render (para el backend). No se deben subir credenciales privadas al repositorio.
