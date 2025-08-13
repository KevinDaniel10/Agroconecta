import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SoporteAdmin = () => {
  const [mensajes, setMensajes] = useState([]);
  const [respuestas, setRespuestas] = useState({}); // almacena respuestas temporales por ID

  const token = localStorage.getItem('token');

  const fetchMensajes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/soporte/soporte`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensajes(res.data);
    } catch (error) {
      console.error('Error al obtener mensajes de soporte:', error);
    }
  };

  const marcarLeido = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/soporte/soporte/${id}/leido`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMensajes();
    } catch (error) {
      console.error('Error al marcar como leído:', error);
    }
  };

  const marcarSolucionado = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/soporte/soporte/${id}/solucionado`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMensajes();
    } catch (error) {
      console.error("Error al marcar como solucionado:", error);
    }
  };

  const enviarRespuesta = async (id) => {
    const mensaje = respuestas[id];
    if (!mensaje || mensaje.trim() === "") return;
    console.log("Enviando respuesta:", mensaje);


    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/soporte/soporte/${id}/responder`, { mensaje }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRespuestas(prev => ({ ...prev, [id]: '' }));
      fetchMensajes();
    } catch (error) {
      console.error("Error al enviar respuesta:", error);
    }
  };

  useEffect(() => {
    fetchMensajes();
  }, []);

 return (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <h2 className="text-xl sm:text-2xl font-bold mb-4">📨 Mensajes de Soporte</h2>

    {mensajes.length === 0 ? (
      <p className="text-gray-500 text-sm sm:text-base">No hay mensajes por mostrar.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {mensajes.map((msg) => (
          <div
            key={msg._id}
            className={`p-4 sm:p-5 border rounded-2xl shadow ${
              msg.leido ? "bg-gray-100" : "bg-white"
            }`}
          >
            {/* Encabezado: remitente + fecha */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
              <p className="text-xs sm:text-sm text-gray-500">
                De:{" "}
                <strong>
                  {msg.usuario?.nombre} {msg.usuario?.apellido}
                </strong>{" "}
                ({msg.rol})
              </p>
              <p className="text-xs sm:text-sm text-gray-400">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Mensaje */}
            <p className="text-gray-800 whitespace-pre-line mb-3 text-sm sm:text-base">
              {msg.mensaje}
            </p>

            {/* Respuestas previas */}
            {msg.respuestas?.length > 0 && (
              <div className="mb-2 border-t pt-2">
                <p className="text-xs sm:text-sm font-semibold text-green-700">Respuestas:</p>
                {msg.respuestas.map((r, idx) => (
                  <div key={idx} className="ml-2 text-xs sm:text-sm text-gray-700 mt-1">
                    🟢 {r.mensaje}
                  </div>
                ))}
              </div>
            )}

            {/* Acciones */}
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              {!msg.leido && (
                <button
                  onClick={() => marcarLeido(msg._id)}
                  className="w-full sm:w-auto text-sm bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                >
                  Marcar como leído
                </button>
              )}

              {!msg.solucionado && (
                <button
                  onClick={() => marcarSolucionado(msg._id)}
                  className="w-full sm:w-auto text-sm bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                >
                  Marcar como solucionado
                </button>
              )}
            </div>

            {/* Responder */}
            <div className="mt-3">
              <textarea
                placeholder="Escribe una respuesta..."
                className="w-full border rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                rows={2}
                value={respuestas[msg._id] || ""}
                onChange={(e) =>
                  setRespuestas({ ...respuestas, [msg._id]: e.target.value })
                }
              />
              <button
                onClick={() => enviarRespuesta(msg._id)}
                className="mt-2 w-full sm:w-auto bg-purple-600 text-white px-3 py-2 rounded text-sm sm:text-base hover:bg-purple-700"
              >
                Enviar respuesta
              </button>
            </div>

            {/* Estados */}
            <div className="mt-2 text-xs sm:text-sm text-green-700 flex flex-wrap gap-3">
              {msg.leido && <span>✅ Leído</span>}
              {msg.solucionado && <span>✔️ Solucionado</span>}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)

};

export default SoporteAdmin;
