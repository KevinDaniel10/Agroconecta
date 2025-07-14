// src/paginas/MisProductos.jsx
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthProvider";

const MisProductos = () => {
  const { auth } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/productos/mis-productos`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos:", error.response?.data?.msg || error.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Listar productos</h1>
      <p className="mb-6 text-gray-600">Este módulo te permite registrar y listar todos los productos registrados</p>

      {cargando ? (
        <p className="text-gray-500">Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p className="text-green-600 flex items-center gap-2">
          <span className="text-xl">✔</span> No existen registros
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div key={producto._id} className="bg-white shadow-md p-4 rounded-lg border">
              <h3 className="text-xl font-semibold text-green-800">{producto.nombre}</h3>
              <p className="text-gray-600">Precio: ${producto.precio}</p>
              <p className="text-gray-600">Stock: {producto.stock} {producto.unidad}</p>
              <p className="text-gray-600">Categoría: {producto.categoria}</p>
              <p className="text-gray-600">Descripción: {producto.descripcion}</p>
              {producto.imagen && (
                <img
                  src={`http://localhost:3000/uploads/${producto.imagen}`}
                  alt={producto.nombre}
                  className="mt-2 h-32 object-cover rounded"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisProductos;
