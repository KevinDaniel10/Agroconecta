import { useContext, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthProvider'
import axios from 'axios'

const Dashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { auth, setAuth, cargando, cerrarSesion } = useContext(AuthContext)
  const urlActual = location.pathname
  const token = localStorage.getItem("token")
  const esProductor = auth?.rol === "productor"

  const activo = 'text-white bg-green-900 px-3 py-2 rounded-md text-lg block'
  const inactivo = 'text-green-200 text-lg block mt-2 hover:text-white'

  // 🛡️ Verificar si la sesión está activa
useEffect(() => {
  const verificarSesionActiva = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;
    if (auth?.rol === "admin") return; // ⛔️ No aplicar esta verificación al admin

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));

      const url = decoded.rol === "cliente"
        ? `${import.meta.env.VITE_BACKEND_URL}/cliente/perfil`
        : `${import.meta.env.VITE_BACKEND_URL}/productor/perfil`;

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data || data?.sesionActiva === false) {
        alert("⚠️ Sesión inactiva. Debes volver a iniciar sesión.");
        cerrarSesion();
      }
    } catch (error) {
      console.error("❌ Error verificando sesión activa:", error.message);
      cerrarSesion();
    }
  };

  if (auth?.rol) {
    verificarSesionActiva();
  }
}, [auth]);


  const handleExit = () => {
    cerrarSesion()
  }

  if (cargando) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-green-700 text-lg font-semibold">Cargando tu información...</p>
      </div>
    )
  }

  return (
  <div className="w-screen min-h-screen md:grid md:grid-cols-[260px_minmax(0,1fr)]">
    {/* SIDEBAR (desktop). En móvil se oculta y usamos menú resumido abajo */}
    <aside className="hidden md:block bg-green-800 px-5 py-4 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
      <h2 className="text-3xl font-black text-center text-white">Gestión Agro</h2>

      <img
        src="https://cdn-icons-png.flaticon.com/512/1973/1973801.png"
        alt="avatar"
        className="m-auto mt-8 p-1 border-2 border-white rounded-full"
        width={120}
        height={120}
      />

      <p className="text-green-100 text-center my-4 text-sm">
        <span className="bg-lime-500 w-3 h-3 inline-block rounded-full"></span>
        &nbsp; Bienvenido - {auth?.nombre || 'Usuario'}
      </p>
      <p className="text-green-100 text-center text-sm">
        <span className="bg-yellow-500 w-3 h-3 inline-block rounded-full"></span>
        &nbsp; Rol - {auth?.rol || 'No definido'}
      </p>

      <hr className="mt-5 border-green-600" />

      <ul className="mt-5 space-y-2 text-center">
        <li>
          <Link to="/dashboard" className={urlActual === '/dashboard' ? activo : inactivo}>Mi Perfil</Link>
        </li>

        {/* Opciones para productor */}
        {esProductor && (
          <>
            <li>
              <Link to="/dashboard/listar" className={urlActual === '/dashboard/listar' ? activo : inactivo}>Mis Productos</Link>
            </li>
            <li>
              <Link to="/dashboard/crear" className={urlActual === '/dashboard/crear' ? activo : inactivo}>Registrar Producto</Link>
            </li>
            <li>
              <Link to="/dashboard/HistorialVentas" className={urlActual === '/dashboard/HistorialVentas' ? activo : inactivo}>Historial de ventas</Link>
            </li>
            <li>
              <Link to="/dashboard/soporte" className={urlActual === '/dashboard/soporte' ? activo : inactivo}>Soporte</Link>
            </li>
          </>
        )}

        {/* Opciones para cliente */}
        {!esProductor && (
          <>
            <li>
              <Link to="/dashboard/comprar" className={urlActual === '/dashboard/comprar' ? activo : inactivo}>Comprar</Link>
            </li>
            <li>
              <Link to="/dashboard/mis-compras" className={urlActual === '/dashboard/mis-compras' ? activo : inactivo}>Mis Compras</Link>
            </li>
            <li>
              <Link to="/dashboard/HistorialCompras" className={urlActual === '/dashboard/HistorialCompras' ? activo : inactivo}>Historial de compras</Link>
            </li>
            <li>
              <Link to="/dashboard/soporte" className={urlActual === '/dashboard/soporte' ? activo : inactivo}>Soporte</Link>
            </li>
          </>
        )}
      </ul>
    </aside>

    {/* MAIN */}
    <div className="flex flex-col min-h-screen bg-green-50">
      {/* Top bar */}
      <div className="bg-green-800 py-2 px-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
        {/* Menú colapsable sólo móvil (sin lógica extra) */}
        <details className="md:hidden w-full">
          <summary className="text-white cursor-pointer select-none py-2 px-3 rounded-lg bg-green-700/60">
            Menú
          </summary>
          <ul className="mt-2 grid grid-cols-2 gap-2 text-center">
            <li>
              <Link to="/dashboard" className={urlActual === '/dashboard' ? activo : inactivo}>Mi Perfil</Link>
            </li>

            {esProductor ? (
              <>
                <li><Link to="/dashboard/listar" className={urlActual === '/dashboard/listar' ? activo : inactivo}>Mis Productos</Link></li>
                <li><Link to="/dashboard/crear" className={urlActual === '/dashboard/crear' ? activo : inactivo}>Registrar Producto</Link></li>
                <li><Link to="/dashboard/HistorialVentas" className={urlActual === '/dashboard/HistorialVentas' ? activo : inactivo}>Historial de ventas</Link></li>
                <li><Link to="/dashboard/soporte" className={urlActual === '/dashboard/soporte' ? activo : inactivo}>Soporte</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/dashboard/comprar" className={urlActual === '/dashboard/comprar' ? activo : inactivo}>Comprar</Link></li>
                <li><Link to="/dashboard/mis-compras" className={urlActual === '/dashboard/mis-compras' ? activo : inactivo}>Mi Carrito</Link></li>
                <li><Link to="/dashboard/HistorialCompras" className={urlActual === '/dashboard/HistorialCompras' ? activo : inactivo}>Historial de compras</Link></li>
                <li><Link to="/dashboard/soporte" className={urlActual === '/dashboard/soporte' ? activo : inactivo}>Soporte</Link></li>
              </>
            )}
          </ul>
        </details>

        <div className="flex items-center gap-3 ml-auto">
          <div className="text-sm sm:text-base font-semibold text-white">
            {auth?.rol === 'productor' ? 'Productor' : 'Cliente'} - {auth?.nombre || 'Usuario'}
          </div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3917/3917132.png"
            alt="img-user"
            className="border-2 border-lime-400 rounded-full w-9 h-9 sm:w-12 sm:h-12"
          />
          <button
            className="text-white text-sm sm:text-base hover:bg-red-900 bg-red-700 px-4 py-1 rounded-lg"
            onClick={handleExit}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Contenido interno */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-green-800">
        <p className="text-center text-white text-xs sm:text-sm py-3 underline">
          Plataforma para Pequeños Productores - Todos los derechos reservados
        </p>
      </footer>
    </div>
  </div>
)

}

export default Dashboard
