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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📨 Mensajes de Soporte</h2>

      {mensajes.length === 0 ? (
        <p className="text-gray-500">No hay mensajes por mostrar.</p>
      ) : (
        <div className="space-y-4">
          {mensajes.map((msg) => (
            <div
              key={msg._id}
              className={`p-4 border rounded-xl shadow ${
                msg.leido ? 'bg-gray-100' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">
                  De: <strong>{msg.usuario?.nombre} {msg.usuario?.apellido}</strong> ({msg.rol})
                </p>
                <p className="text-sm text-gray-400">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>

              <p className="text-gray-800 whitespace-pre-line mb-3">{msg.mensaje}</p>

              {msg.respuestas?.length > 0 && (
                <div className="mb-2 border-t pt-2">
                  <p className="text-sm font-semibold text-green-700">Respuestas:</p>
                  {msg.respuestas.map((r, idx) => (
                    <div key={idx} className="ml-2 text-sm text-gray-700 mt-1">🟢 {r.mensaje}</div>
                  ))}
                </div>
              )}

              <div className="mt-2 space-x-2">
                {!msg.leido && (
                  <button
                    onClick={() => marcarLeido(msg._id)}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Marcar como leído
                  </button>
                )}

                {!msg.solucionado && (
                  <button
                    onClick={() => marcarSolucionado(msg._id)}
                    className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Marcar como solucionado
                  </button>
                )}
              </div>

              <div className="mt-3">
                <textarea
                  placeholder="Escribe una respuesta..."
                  className="w-full border p-2 rounded text-sm"
                  rows={2}
                  value={respuestas[msg._id] || ""}
                  onChange={(e) =>
                    setRespuestas({ ...respuestas, [msg._id]: e.target.value })
                  }
                />
                <button
                  onClick={() => enviarRespuesta(msg._id)}
                  className="mt-2 bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                >
                  Enviar respuesta
                </button>
              </div>

              <div className="mt-2 text-sm text-green-700 space-x-4">
                {msg.leido && <span>✅ Leído</span>}
                {msg.solucionado && <span>✔️ Solucionado</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoporteAdmin;
