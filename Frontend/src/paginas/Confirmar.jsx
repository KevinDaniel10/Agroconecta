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
  <div className="w-full min-h-screen flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-sm sm:max-w-md text-center">
      {Object.keys(mensaje).length > 0 && (
        <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
      )}

        <img
      className="mx-auto object-cover w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full border-4 border-slate-600"
      src="/images/recuperaragro.png"
      alt="Confirmación"
    />


      <div className="mt-8 sm:mt-10">
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-800">¡Muchas gracias!</p>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600">
          Ya puedes iniciar sesión
        </p>
        <Link
          to="/login"
          className="inline-block w-full sm:w-auto mt-6 sm:mt-8 px-5 sm:px-6 py-2.5 bg-gray-600 text-slate-100 rounded-xl hover:bg-gray-900 transition-transform duration-300 hover:scale-105"
        >
          Iniciar sesión
        </Link>
      </div>
    </div>
  </div>
)

};
