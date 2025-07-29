import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  UsersIcon,
  BarChart2Icon,
  HelpCircleIcon,
  LogOutIcon,
} from "lucide-react";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const navItemClass = (path) =>
    currentPath === path
      ? "bg-green-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
      : "text-green-100 hover:bg-green-600 px-4 py-2 rounded-lg transition flex items-center gap-2";

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/admin", { replace: true });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/admin");
  }, []);

  return (
    <div className="flex w-full h-screen bg-green-50">
      {/* Sidebar */}
      <aside className="w-72 bg-green-800 text-white flex flex-col justify-between h-full sticky top-0">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-center mb-8">Admin</h1>

          <nav className="space-y-3">
            <Link
              to="/admin/dashboard/usuarios"
              className={navItemClass("/admin/dashboard/usuarios")}
            >
              <UsersIcon size={18} />
              Gestión de Usuarios
            </Link>

            <Link
              to="/admin/dashboard/metricas"
              className={navItemClass("/admin/dashboard/metricas")}
            >
              <BarChart2Icon size={18} />
              Métricas
            </Link>

            <Link
              to="/admin/dashboard/soporte"
              className={navItemClass("/admin/dashboard/soporte")}
            >
              <HelpCircleIcon size={18} />
              Soporte
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-green-600">
          <button
            onClick={cerrarSesion}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <LogOutIcon size={16} />
            Cerrar sesión
          </button>
          <p className="text-xs text-center mt-4 text-green-300">
            © 2025 Agroconecta
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-green-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
