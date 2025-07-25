import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Mensaje from "./Alertas";
import AuthContext from "../context/AuthProvider";

export const Formulario = ({ producto }) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({});
  const [imagenPreview, setImagenPreview] = useState(producto?.imagen || "");

  const [form, setForm] = useState({
    nombre: producto?.nombre ?? "",
    precio: producto?.precio ?? "",
    stock: producto?.stock ?? "",
    unidad: producto?.unidad ?? "",
    categoria: producto?.categoria ?? "",
    descripcion: producto?.descripcion ?? "",
    imagen: null, // archivo
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagen") {
      setForm({ ...form, imagen: files[0] });
      setImagenPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const camposRequeridos = ["nombre", "precio", "stock", "unidad", "categoria", "descripcion"];
    for (let campo of camposRequeridos) {
      if (!form[campo]) {
        setMensaje({ respuesta: `El campo "${campo}" es obligatorio`, tipo: false });
        setTimeout(() => setMensaje({}), 3000);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = new FormData();

      // Agregar todos los campos normales
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      // Agregar el productor manualmente
      formData.append("productor", auth._id);
      console.log("Datos enviados:", Object.fromEntries(formData.entries())); // VERIFICACIÓN

      let url, response;
      if (producto?._id) {
        url = `${import.meta.env.VITE_BACKEND_URL}/productos/actualizar/${producto._id}`;
        response = await axios.put(url, formData, options);
      } else {
        url = `${import.meta.env.VITE_BACKEND_URL}/productos/registro`;
        response = await axios.post(url, formData, options);
      }

      setMensaje({ respuesta: response.data.msg, tipo: true });
      setTimeout(() => navigate("/dashboard/productos"), 3000);
    } catch (error) {
      setMensaje({
        respuesta: error.response?.data?.msg || "Error al procesar el formulario",
        tipo: false,
      });
      setTimeout(() => setMensaje({}), 3000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-xl space-y-6"
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-bold text-green-800 text-center">Registrar producto</h2>

      {Object.keys(mensaje).length > 0 && (
        <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
      )}

      {/* Campos de texto */}
      {[ 
        { name: "nombre", label: "Nombre del producto", placeholder: "Ej: Queso artesanal" },
        { name: "precio", label: "Precio ($)", type: "number", placeholder: "Ej: 4.50" },
        { name: "stock", label: "Stock disponible", type: "number", placeholder: "Ej: 25" }
      ].map(({ name, label, type, placeholder }) => (
        <div key={name}>
          <label htmlFor={name} className="block font-semibold text-gray-700 mb-1">
            {label}:
          </label>
          <input
            type={type || "text"}
            id={name}
            name={name}
            value={form[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      ))}

      {/* Select: unidad */}
      <div>
        <label htmlFor="unidad" className="block font-semibold text-gray-700 mb-1">
          Unidad de medida:
        </label>
        <select
          id="unidad"
          name="unidad"
          value={form.unidad}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:outline-none"
        >
          <option value="">-- Selecciona unidad --</option>
          <option value="Kilogramo (kg)">Kilogramo (kg)</option>
          <option value="Litro (l)">Litro (l)</option>
          <option value="Unidad">Unidad</option>
        </select>
      </div>

      {/* Select: categoría */}
      <div>
        <label htmlFor="categoria" className="block font-semibold text-gray-700 mb-1">
          Categoría:
        </label>
        <select
          id="categoria"
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:outline-none"
        >
          <option value="">-- Selecciona categoría --</option>
          <option value="Verduras">Verduras</option>
          <option value="Lácteos">Lácteos</option>
          <option value="Frutas">Frutas</option>
          <option value="Cereales">Cereales</option>
        </select>
      </div>

      {/* Textarea descripción */}
      <div>
        <label htmlFor="descripcion" className="block font-semibold text-gray-700 mb-1">
          Descripción:
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Ej: Producto fresco cultivado sin químicos..."
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:outline-none"
          rows="3"
        />
      </div>

      {/* Imagen */}
      <div>
        <label htmlFor="imagen" className="block font-semibold text-gray-700 mb-1">
          Imagen del producto (opcional):
        </label>
        <input
          type="file"
          id="imagen"
          name="imagen"
          accept="image/*"
          onChange={handleChange}
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
        />
        {imagenPreview && (
          <img
            src={imagenPreview}
            alt="Vista previa"
            className="mt-4 h-32 object-cover rounded-md"
          />
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-md font-bold text-lg transition"
      >
        {producto?._id ? "Actualizar producto" : "Registrar producto"}
      </button>
    </form>
  );
};
