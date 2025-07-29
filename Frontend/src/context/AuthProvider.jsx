import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const perfil = async (token) => {
    try {
      const decoded = jwtDecode(token);

      const url =
        decoded.rol === "cliente"
          ? `${import.meta.env.VITE_BACKEND_URL}/cliente/perfil`
          : decoded.rol === "productor"
          ? `${import.meta.env.VITE_BACKEND_URL}/productor/perfil`
          : `${import.meta.env.VITE_BACKEND_URL}/admin/perfil`;

      const { data } = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Verificar si la sesión sigue activa
      if (data?.sesionActiva === false) {
        throw new Error("Sesión inactiva");
      }

      setAuth({ ...data, rol: decoded.rol });
    } catch (error) {
      console.error("Error cargando perfil:", error.message);
      setAuth({});
      localStorage.removeItem("token");
      navigate("/login");
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

  // 🔒 Cierre por inactividad
  useEffect(() => {
    let timeout;

    const cerrarSesionPorInactividad = () => {
      localStorage.removeItem("token");
      localStorage.setItem("logout", Date.now());
      setAuth({});
      alert("⚠️ Sesión cerrada por inactividad.");
      navigate("/login");
    };

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(cerrarSesionPorInactividad, 5 * 60 * 1000);
    };

    const eventos = ["mousemove", "keydown", "click", "scroll"];
    eventos.forEach((ev) => window.addEventListener(ev, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeout);
      eventos.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, []);

  // 🔁 Logout sincronizado entre pestañas
  useEffect(() => {
    const sincronizarLogout = (e) => {
      if (e.key === "logout") {
        setAuth({});
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    window.addEventListener("storage", sincronizarLogout);
    return () => window.removeEventListener("storage", sincronizarLogout);
  }, []);

  // 🛡 Verificación periódica de sesión activa
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await perfil(token); // si falla, el catch en `perfil` se encarga
      } catch (error) {
        console.warn("Sesión inválida o cerrada:", error.message);
      }
    }, 60 * 1000); // cada 60 segundos

    return () => clearInterval(interval);
  }, []);

  const cerrarSesion = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const url =
        decoded.rol === "cliente"
          ? `${import.meta.env.VITE_BACKEND_URL}/cliente/logout`
          : decoded.rol === "productor"
          ? `${import.meta.env.VITE_BACKEND_URL}/productor/logout`
          : `${import.meta.env.VITE_BACKEND_URL}/admin/logout`;

      await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    } finally {
      localStorage.removeItem("token");
      localStorage.setItem("logout", Date.now());
      setAuth({});
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, cargando, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
