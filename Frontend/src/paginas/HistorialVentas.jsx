import { useEffect, useState } from "react";
import axios from "axios";

const HistorialVentas = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const obtenerVentas = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/productor/historial-ventas`, config);
        console.log("🧾 Historial ventas:", data);
        setVentas(data);
      } catch (error) {
        console.error("❌ Error al obtener historial de ventas:", error);
      }
    };

    obtenerVentas();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-900">Historial de Ventas</h2>
      {ventas.length === 0 ? (
        <p className="text-gray-600">No has registrado ventas todavía.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ventas.map((venta, i) => (
            <div key={i} className="bg-white shadow-md p-4 rounded border">
              <p className="font-semibold text-green-800">{venta.producto?.nombre || "Producto eliminado"}</p>
              <p className="text-sm text-gray-600">Cantidad: {venta.cantidad}</p>
              <p className="text-sm text-gray-600">Precio: ${venta.precioUnitario}</p>
              <p className="text-sm text-gray-600">
                Cliente: {venta.cliente?.nombre} {venta.cliente?.apellido}
              </p>
              <p className="text-xs text-gray-500">Fecha: {new Date(venta.fecha).toLocaleDateString()}</p>
              <p className="text-sm text-green-700 font-semibold">
  Total vendido: ${venta.precioUnitario * venta.cantidad}
</p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorialVentas;
