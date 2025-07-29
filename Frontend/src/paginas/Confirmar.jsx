import logoDog from '../assets/dog-hand.webp';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Mensaje from '../componets/Alertas';
import axios from 'axios';

export const Confirmar = () => {
    const { token } = useParams();
    const [mensaje, setMensaje] = useState({});

    // ✅ Recuperar el rol desde localStorage
    const rol = localStorage.getItem("rol") || "productor";
    console.log("Rol detectado:", rol);

    const verifyToken = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/${rol}/confirmar/${token}`;
            console.log("Verificando con URL:", url);

            const respuesta = await axios.get(url);
            setMensaje({ respuesta: respuesta.data.msg, tipo: true });
        } catch (error) {
            console.error("Error al confirmar:", error.response?.data?.msg || error.message);
            setMensaje({
                respuesta: error.response?.data?.msg || "Error al confirmar la cuenta.",
                tipo: false
            });
        }
    };

    useEffect(() => {
        verifyToken();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            {Object.keys(mensaje).length > 0 && (
                <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
            )}

            <img
                className="object-cover h-80 w-80 rounded-full border-4 border-solid border-slate-600"
                src={logoDog}
                alt="Confirmación"
            />

            <div className="flex flex-col items-center justify-center">
                <p className="text-3xl md:text-4xl lg:text-5xl text-gray-800 mt-12">¡Muchas gracias!</p>
                <p className="md:text-lg lg:text-xl text-gray-600 mt-8">
                    Ya puedes iniciar sesión
                </p>
                <Link
                    to="/login"
                    className="p-3 m-5 w-full text-center bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white"
                >
                    Iniciar sesión
                </Link>
            </div>
        </div>
    );
};
