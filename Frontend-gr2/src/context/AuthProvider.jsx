import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [cargando, setCargando] = useState(true);

  const perfil = async (token) => {
    try {
      const decoded = jwtDecode(token);

      const url =
        decoded.rol === "cliente"
          ? `${import.meta.env.VITE_BACKEND_URL}/cliente/perfil`
          : `${import.meta.env.VITE_BACKEND_URL}/productor/perfil`;

      const { data } = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Log para verificar si el rol se carga correctamente
      console.log("auth cargado:", { ...data, rol: decoded.rol });

      // Guardar auth con el rol incluido
      setAuth({ ...data, rol: decoded.rol });

    } catch (error) {
      console.error("Error cargando perfil:", error);
      setAuth({});
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      perfil(token);
    } else {
      setCargando(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        cargando,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
