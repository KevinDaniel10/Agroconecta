import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartProvider";

const Comprar = () => {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
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
          "http://localhost:3000/api/productos/disponibles",
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

  const handleAgregar = (producto) => {
    const cantidad = parseInt(cantidades[producto._id]) || 1;

    if (cantidad > producto.stock) {
      alert("No puedes agregar más de lo disponible en stock.");
      return;
    }

    // Agrega al carrito con la cantidad indicada
    agregarAlCarrito(producto, cantidad);

    // Resta el stock visualmente (solo frontend)
    setProductos((prevProductos) =>
      prevProductos.map((p) =>
        p._id === producto._id
          ? { ...p, stock: p.stock - cantidad }
          : p
      )
    );
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-green-900">Comprar Productos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {productos.map((producto) => (
          <div
            key={producto._id}
            className="border border-green-300 rounded p-4 shadow bg-white"
          >
            <h3 className="text-lg font-semibold text-green-800">{producto.nombre}</h3>
            <p className="text-gray-700 text-sm">{producto.descripcion}</p>
            <p className="mt-2 font-bold text-green-700">
              ${producto.precio} / {producto.unidad}
            </p>
            <p className="text-gray-600 text-sm">Stock: {producto.stock}</p>
            <p className="text-gray-600 text-sm">
              Productor: {producto.productor?.nombre}
            </p>

            <input
              type="number"
              min="1"
              max={producto.stock}
              value={cantidades[producto._id] || 1}
              onChange={(e) =>
                handleCantidadChange(producto._id, e.target.value)
              }
              className="border rounded px-2 py-1 w-full mt-2"
            />

            <button
              onClick={() => handleAgregar(producto)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 w-full"
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comprar;
