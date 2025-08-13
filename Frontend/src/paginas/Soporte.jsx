import { useState } from "react";
import axios from "axios";

const Soporte = () => {
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleEnviar = async () => {
    if (!mensaje.trim()) {
      setError("El mensaje no puede estar vacío.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
  `${import.meta.env.VITE_BACKEND_URL}/soporte/soporte`,
  { mensaje },
  config
);
      setEnviado(true);
      setMensaje("");
      setError("");
    } catch (error) {
      console.error("Error al enviar soporte:", error);
      setError("Ocurrió un error al enviar el mensaje.");
    }
  };

 return (
  <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-green-900">Soporte</h2>
    <p className="mb-4 text-sm sm:text-base text-gray-700">
      ¿Tienes algún problema o duda? Escribe tu mensaje y nuestro equipo lo revisará pronto.
    </p>

    <textarea
      className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 mb-2 sm:mb-3 min-h-[160px] sm:min-h-[200px] focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
      rows="5"
      placeholder="Escribe tu mensaje aquí..."
      value={mensaje}
      onChange={(e) => setMensaje(e.target.value)}
    ></textarea>

    {error && <p className="text-red-600 mb-2 text-sm sm:text-base">{error}</p>}
    {enviado && (
      <p className="text-green-600 mb-2 text-sm sm:text-base">✅ Mensaje enviado correctamente</p>
    )}

    <button
      onClick={handleEnviar}
      className="w-full sm:w-auto bg-green-700 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-green-800 active:bg-green-900 transition-colors"
    >
      Enviar mensaje
    </button>
  </div>
)

};

export default Soporte;
