import { useContext, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import Mensaje from "../Alertas";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const FormularioPerfil = () => {
  const { auth } = useContext(AuthContext);
  const [mensaje, setMensaje] = useState({});

  const [form, setForm] = useState({
    id: auth._id,
    nombre: auth.nombre || "",
    apellido: auth.apellido || "",
    direccion: auth.direccion || "",
    telefono: auth.telefono || "",
    email: auth.email || "",
    rol: auth.rol || ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const actualizarPerfil = async (datos) => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const rol = decoded.rol;

      const url =
        rol === "cliente"
          ? `${import.meta.env.VITE_BACKEND_URL}/cliente/actualizar/${datos.id}`
          : `${import.meta.env.VITE_BACKEND_URL}/productor/actualizar/${datos.id}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      const { data } = await axios.put(url, datos, config);
      return { respuesta: data.msg, tipo: true };
    } catch (error) {
      return {
        respuesta: error.response?.data?.msg || "Error al actualizar perfil",
        tipo: false
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      [form.nombre, form.apellido, form.direccion, form.telefono].includes("")
    ) {
      setMensaje({
        respuesta: "Todos los campos deben ser ingresados",
        tipo: false
      });
      setTimeout(() => setMensaje({}), 3000);
      return;
    }

    const resultado = await actualizarPerfil(form);
    setMensaje(resultado);
    setTimeout(() => setMensaje({}), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Perfil del {auth?.rol === "cliente" ? "cliente" : "productor"}
          </h2>
          <p className="text-gray-600 mb-4">Edita tus datos personales</p>

          {Object.keys(mensaje).length > 0 && (
            <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
          )}

          {["nombre", "apellido", "direccion", "telefono"].map((campo, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700 uppercase">
                {campo}:
              </label>
              <input
                type="text"
                name={campo}
                value={form[campo]}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                placeholder={`Ingrese ${campo}`}
              />
            </div>
          ))}

          {/* Email no editable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 uppercase">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
              className="mt-1 block w-full bg-gray-100 text-gray-500 border border-gray-300 rounded-md shadow-sm p-2 cursor-not-allowed"
            />
          </div>

          <div>
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white w-full py-2 rounded-md font-semibold transition-all"
            >
              Actualizar
            </button>
          </div>
        </form>

        {/* Resumen visual */}
        <div className="bg-gray-50 rounded-xl shadow p-6 flex flex-col items-center justify-center">
          <img
            src={
              auth.rol === "cliente"
                ? "https://cdn-icons-png.flaticon.com/512/2922/2922688.png"
                : "https://cdn-icons-png.flaticon.com/512/921/921347.png"
            }
            alt="avatar"
            className="w-24 h-24 rounded-full border-2 border-green-500 mb-4"
          />
          <div className="text-left space-y-2 text-sm text-gray-800">
            <p><strong>Nombre:</strong> {form.nombre}</p>
            <p><strong>Apellido:</strong> {form.apellido}</p>
            <p><strong>Email:</strong> {form.email}</p>
            <p><strong>Teléfono:</strong> {form.telefono}</p>
            <p><strong>Dirección:</strong> {form.direccion}</p>
            <p><strong>Rol:</strong> {auth.rol}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioPerfil;
