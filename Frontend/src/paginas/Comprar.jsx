import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartProvider";

const Comprar = () => {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [busqueda, setBusqueda] = useState(""); // ✅ Búsqueda
  const { agregarAlCarrito } = useContext(CartContext);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/productos/disponibles`,
          config
        );
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    obtenerProductos();
  }, []);

  const handleCantidadChange = (id, value) => {
    const cantidad = parseInt(value);
    if (!isNaN(cantidad) && cantidad >= 1) {
      setCantidades((prev) => ({ ...prev, [id]: cantidad }));
    }
  };

  const handleAgregar = async (producto) => {
    const cantidad = parseInt(cantidades[producto._id]) || 1;

    if (cantidad > producto.stock) {
      alert("No puedes agregar más de lo disponible en stock.");
      return;
    }

    agregarAlCarrito(producto, cantidad);

    setProductos((prevProductos) =>
      prevProductos.map((p) =>
        p._id === producto._id
          ? { ...p, stock: p.stock - cantidad }
          : p
      )
    );

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/productos/reducir-stock/${producto._id}`,
        { cantidad },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error al reducir stock:", error.response?.data?.msg || error.message);
    }
  };

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-green-900">Comprar Productos</h2>

    {/* ✅ Input de búsqueda responsive */}
    <input
      type="text"
      placeholder="Buscar por nombre o categoría..."
      className="w-full mb-6 p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {productosFiltrados.map((producto) => (
        <div
          key={producto._id}
          className="bg-white border border-green-200 rounded-xl p-4 sm:p-5 shadow hover:shadow-md transition-shadow flex flex-col"
        >
          <div className="flex-1 space-y-1">
            <h3 className="text-base sm:text-lg font-semibold text-green-800">
              {producto.nombre}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">{producto.descripcion}</p>
            <p className="text-xs sm:text-sm text-gray-500">Categoría: {producto.categoria}</p>

            <p className="mt-2 font-bold text-green-700 text-sm sm:text-base">
              ${producto.precio} / {producto.unidad}
            </p>
            <p className="text-gray-600 text-sm">Stock: {producto.stock}</p>
            <p className="text-gray-600 text-sm">Productor: {producto.productor?.nombre}</p>

            {/* ✅ Imagen del producto (manteniendo tu lógica) */}
            {producto.imagen && (
              <img
                src={`${import.meta.env.VITE_BACKEND_URL2}/uploads/${producto.imagen}`}
                alt={producto.nombre}
                className="mt-2 w-full h-40 sm:h-44 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="mt-3">
            <input
              type="number"
              min="1"
              max={producto.stock}
              value={cantidades[producto._id] || 1}
              onChange={(e) => handleCantidadChange(producto._id, e.target.value)}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
            />

            <button
              onClick={() => handleAgregar(producto)}
              className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)

};

export default Comprar;
