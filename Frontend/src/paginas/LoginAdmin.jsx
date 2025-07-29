import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const LoginAdmin = () => {
  const [email, setEmail] = useState("admin@agro.com");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext); // ✅ para guardar en contexto

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return alert("Todos los campos son obligatorios");
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/login`, {
        email,
        password,
      });

      localStorage.setItem("token", data.token);

      // ✅ Guardar info en el contexto
      setAuth({
        rol: "admin",
        id: data.id,        // asegúrate que el backend retorne esto
        nombre: data.nombre // asegúrate que el backend retorne esto
      });

      navigate("/admin/dashboard");
    } catch (error) {
      alert(error.response?.data?.msg || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-800 text-center mb-6">Administrador</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
