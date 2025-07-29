import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthProvider";

const HistorialCompras = () => {
  const { auth } = useContext(AuthContext);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cliente/historial`, config);
        console.log("🧾 Historial de compras:", data);
        setHistorial(data || []);
      } catch (error) {
        console.error("❌ Error al obtener historial:", error.response?.data?.msg || error.message);
      }
    };

    obtenerHistorial();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Historial de Compras</h1>
      {historial.length === 0 ? (
        <p className="text-green-700">No has realizado compras todavía.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historial.map((item, index) => (
            <div key={index} className="bg-white shadow-md rounded p-4 border">
              <p className="text-lg font-semibold text-green-800">Producto: {item.nombreProducto}</p>
              <p className="text-gray-600">Cantidad: {item.cantidad}</p>
              <p className="text-gray-600">Precio Unitario: ${item.precioUnitario}</p>
              <p className="text-gray-500 text-sm">Fecha: {new Date(item.fecha).toLocaleDateString()}</p>
              <p className="text-sm text-green-700 font-semibold">
  Total: ${item.cantidad * item.precioUnitario}
</p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorialCompras;

