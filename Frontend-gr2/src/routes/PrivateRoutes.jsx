import { Navigate } from "react-router-dom"

// Proteger rutas privadas
export const PrivateRoute = ({ children }) => {
    // Obtener el token del localStorage 
    const autenticado = localStorage.getItem("token")

    // Retornar la carga si esta autenticado, caso contraro enviar al login
    return (autenticado) ? children : <Navigate to="/login"/>
}  