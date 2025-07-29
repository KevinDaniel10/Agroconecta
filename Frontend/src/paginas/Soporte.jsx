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

      const { data } = await axios.post("http://localhost:3000/api/soporte/soporte", { mensaje }, config);
      setEnviado(true);
      setMensaje("");
      setError("");
    } catch (error) {
      console.error("Error al enviar soporte:", error);
      setError("Ocurrió un error al enviar el mensaje.");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-green-900">Soporte</h2>
      <p className="mb-4 text-gray-700">
        ¿Tienes algún problema o duda? Escribe tu mensaje y nuestro equipo lo revisará pronto.
      </p>

      <textarea
        className="w-full border rounded p-2 mb-2"
        rows="5"
        placeholder="Escribe tu mensaje aquí..."
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      ></textarea>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {enviado && <p className="text-green-600 mb-2">✅ Mensaje enviado correctamente</p>}

      <button
        onClick={handleEnviar}
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
      >
        Enviar mensaje
      </button>
    </div>
  );
};

export default Soporte;
