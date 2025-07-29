import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthProvider";

const PrivateRouteAdmin = ({ children }) => {
  const { auth, cargando } = useContext(AuthContext);

  if (cargando) return null;

  if (!auth?.rol || auth.rol !== "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default PrivateRouteAdmin;
