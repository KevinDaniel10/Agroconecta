// src/paginas/MisCompras.jsx
import { useCart } from "../context/CartProvider";
import { useEffect } from "react";
import axios from "axios";


const MisCompras = () => {
  const { carrito, eliminarDelCarrito, vaciarCarrito } = useCart();

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  useEffect(() => {
    console.log("Carrito actual:", carrito);
  }, [carrito]);

  const handleConfirmarCompra = async () => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const productosParaComprar = carrito.map(({ _id, cantidad }) => ({
      productoId: _id,
      cantidad,
    }));

    const { data } = await axios.post(
      "http://localhost:3000/api/cliente/confirmar-compra",
      { productos: productosParaComprar },
      config
    );

    alert("✅ Compra confirmada con éxito.");
    vaciarCarrito();
  } catch (error) {
    console.error("❌ Error al confirmar la compra:", error);
    alert("❌ Hubo un error al confirmar la compra.");
  }
};


  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-green-900">Mi Carrito</h2>

      {carrito.length === 0 ? (
        <p className="text-gray-600">Tu carrito está vacío.</p>
      ) : (
        <div className="space-y-4">
          {carrito.map((producto) => (
            <div
              key={producto._id}
              className="flex justify-between items-center border p-4 rounded shadow bg-white"
            >
              <div>
                <h3 className="font-semibold text-green-800">{producto.nombre}</h3>
                <p className="text-sm text-gray-600">Cantidad: {producto.cantidad}</p>
                <p className="text-sm text-gray-600">Precio unitario: ${producto.precio}</p>
                <p className="text-sm text-gray-600">
                  Subtotal: ${producto.precio * producto.cantidad}
                </p>
              </div>
              <button
                onClick={() => eliminarDelCarrito(producto._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          ))}

          <div className="mt-4 text-right">
            <p className="font-bold text-green-900 text-lg">Total: ${total.toFixed(2)}</p>
            <button
              onClick={handleConfirmarCompra}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Confirmar Compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisCompras;
