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
    <div className="space-y-10">
      {/* PRODUCTORES */}
      <section>
        <h2 className="text-xl font-bold text-green-800 mb-2">Productores</h2>
        <table className="w-full bg-green-200 rounded overflow-hidden text-left">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Apellido</th>
              <th className="px-4 py-2">Telefono</th>
              <th className="px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {productores.map((prod) => (
              <tr key={prod._id} className="hover:bg-green-100">
                <td className="px-4 py-2">{prod.nombre}</td>
                <td className="px-4 py-2">{prod.apellido}</td>
                <td className="px-4 py-2">{prod.telefono}</td>
                <td className="px-4 py-2">{prod.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* CLIENTES */}
      <section>
        <h2 className="text-xl font-bold text-green-800 mb-2">Clientes</h2>
        <table className="w-full bg-green-200 rounded overflow-hidden text-left">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Apellido</th>
              <th className="px-4 py-2">Telefono</th>
              <th className="px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cli) => (
              <tr key={cli._id} className="hover:bg-green-100">
                <td className="px-4 py-2">{cli.nombre}</td>
                <td className="px-4 py-2">{cli.apellido}</td>
                <td className="px-4 py-2">{cli.telefono}</td>
                <td className="px-4 py-2">{cli.email}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default VistaUsuarios;
