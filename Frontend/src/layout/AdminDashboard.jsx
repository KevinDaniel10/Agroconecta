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
  <div className="w-screen min-h-screen bg-green-50 md:grid md:grid-cols-[18rem_minmax(0,1fr)]">
    {/* SIDEBAR DESKTOP */}
    <aside className="hidden md:flex bg-green-800 text-white flex-col justify-between h-screen sticky top-0">
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
        <p className="text-xs text-center mt-4 text-green-300">© 2025 Agroconecta</p>
      </div>
    </aside>

    {/* CONTENEDOR PRINCIPAL */}
    <div className="flex flex-col min-h-screen">
      {/* TOPBAR MÓVIL */}
      <header className="md:hidden bg-green-800 text-white sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin</h1>

          {/* Menú colapsable sin cambiar lógica */}
          <details className="relative">
            <summary className="list-none cursor-pointer select-none bg-green-700/60 px-3 py-1 rounded">
              Menú
            </summary>
            <nav className="absolute right-0 mt-2 w-64 bg-green-900 rounded-lg shadow-lg p-2 space-y-2">
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

              <button
                onClick={cerrarSesion}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded flex items-center justify-center gap-2"
              >
                <LogOutIcon size={16} />
                Cerrar sesión
              </button>

              <p className="text-[10px] text-center mt-1 text-green-300">© 2025 Agroconecta</p>
            </nav>
          </details>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
)

};

export default AdminDashboard;
