import { useEffect, useState } from "react";
import axios from "axios";
import { MdCleaningServices } from "react-icons/md";

const VistaUsuarios = () => {
  const [productores, setProductores] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const obtenerProductores = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/productor/productores`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Verificamos si data es array o está dentro de una propiedad
        const lista = Array.isArray(data) ? data : data.productores || [];
        console.log("🔎 Productores recibidos:", data);
        setProductores(lista);

      } catch (error) {
        console.error("❌ Error al obtener productores:", error);
      }
    };
   

    const obtenerClientes = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/cliente/clientes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const lista = Array.isArray(data) ? data : data.clientes || [];
        setClientes(lista);
      } catch (error) {
        console.error("❌ Error al obtener clientes:", error);
      }
    };

    obtenerProductores();
    obtenerClientes();
  }, []);

return (
  <div className="space-y-10 px-4 sm:px-6 lg:px-8">
    {/* PRODUCTORES */}
    <section>
      <h2 className="text-lg sm:text-xl font-bold text-green-800 mb-3">Productores</h2>

      {/* Vista cards en móvil */}
      <div className="md:hidden space-y-3">
        {productores.map((prod) => (
          <div
            key={prod._id}
            className="bg-white rounded-lg shadow border border-green-200 p-4 grid grid-cols-2 gap-x-4 gap-y-2"
          >
            <span className="text-xs font-semibold text-gray-500">Nombre</span>
            <span className="text-sm text-gray-800">{prod.nombre}</span>

            <span className="text-xs font-semibold text-gray-500">Apellido</span>
            <span className="text-sm text-gray-800">{prod.apellido}</span>

            <span className="text-xs font-semibold text-gray-500">Teléfono</span>
            <span className="text-sm text-gray-800 whitespace-nowrap">{prod.telefono}</span>

            <span className="text-xs font-semibold text-gray-500">Email</span>
            <span className="text-sm text-gray-800 break-all">{prod.email}</span>
          </div>
        ))}
      </div>

      {/* Tabla en ≥ md con scroll horizontal si hace falta */}
      <div className="hidden md:block overflow-x-auto rounded-lg ring-1 ring-green-200">
        <table className="min-w-full bg-green-50 text-left">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-4 py-2 text-sm font-semibold">Nombre</th>
              <th className="px-4 py-2 text-sm font-semibold">Apellido</th>
              <th className="px-4 py-2 text-sm font-semibold">Teléfono</th>
              <th className="px-4 py-2 text-sm font-semibold">Email</th>
            </tr>
          </thead>
          <tbody>
            {productores.map((prod) => (
              <tr key={prod._id} className="odd:bg-white even:bg-green-100/40 hover:bg-green-100">
                <td className="px-4 py-2">{prod.nombre}</td>
                <td className="px-4 py-2">{prod.apellido}</td>
                <td className="px-4 py-2 whitespace-nowrap">{prod.telefono}</td>
                <td className="px-4 py-2 break-all">{prod.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    {/* CLIENTES */}
    <section>
      <h2 className="text-lg sm:text-xl font-bold text-green-800 mb-3">Clientes</h2>

      {/* Vista cards en móvil */}
      <div className="md:hidden space-y-3">
        {clientes.map((cli) => (
          <div
            key={cli._id}
            className="bg-white rounded-lg shadow border border-green-200 p-4 grid grid-cols-2 gap-x-4 gap-y-2"
          >
            <span className="text-xs font-semibold text-gray-500">Nombre</span>
            <span className="text-sm text-gray-800">{cli.nombre}</span>

            <span className="text-xs font-semibold text-gray-500">Apellido</span>
            <span className="text-sm text-gray-800">{cli.apellido}</span>

            <span className="text-xs font-semibold text-gray-500">Teléfono</span>
            <span className="text-sm text-gray-800 whitespace-nowrap">{cli.telefono}</span>

            <span className="text-xs font-semibold text-gray-500">Email</span>
            <span className="text-sm text-gray-800 break-all">{cli.email}</span>
          </div>
        ))}
      </div>

      {/* Tabla en ≥ md con scroll horizontal si hace falta */}
      <div className="hidden md:block overflow-x-auto rounded-lg ring-1 ring-green-200">
        <table className="min-w-full bg-green-50 text-left">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-4 py-2 text-sm font-semibold">Nombre</th>
              <th className="px-4 py-2 text-sm font-semibold">Apellido</th>
              <th className="px-4 py-2 text-sm font-semibold">Teléfono</th>
              <th className="px-4 py-2 text-sm font-semibold">Email</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cli) => (
              <tr key={cli._id} className="odd:bg-white even:bg-green-100/40 hover:bg-green-100">
                <td className="px-4 py-2">{cli.nombre}</td>
                <td className="px-4 py-2">{cli.apellido}</td>
                <td className="px-4 py-2 whitespace-nowrap">{cli.telefono}</td>
                <td className="px-4 py-2 break-all">{cli.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </div>
)

};

export default VistaUsuarios;
