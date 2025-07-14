import { useContext } from 'react'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import AuthContext from '../context/AuthProvider'

const Dashboard = () => {
    const location = useLocation()
    const { auth, setAuth, cargando } = useContext(AuthContext)
    const tokenAuth = localStorage.getItem("token")
    const urlActual = location.pathname

    const handleExit = () => {
        localStorage.removeItem("token")
        setAuth({})
    }

    const esProductor = auth?.rol === "productor"

    const activo = 'text-white bg-green-900 px-3 py-2 rounded-md text-lg block'
    const inactivo = 'text-green-200 text-lg block mt-2 hover:text-white'

    // Mostrar loading mientras cargamos el perfil
    if (cargando) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-green-700 text-lg font-semibold">Cargando tu información...</p>
            </div>
        )
    }

    return (
        <div className='md:flex md:min-h-screen'>
            {/* Sidebar */}
            <div className='md:w-1/5 bg-green-800 px-5 py-4'>
                <h2 className='text-3xl font-black text-center text-white'>Gestión Agro</h2>
                <img src="https://cdn-icons-png.flaticon.com/512/1973/1973801.png" alt="avatar" className="m-auto mt-8 p-1 border-2 border-white rounded-full" width={120} height={120} />
                <p className='text-green-100 text-center my-4 text-sm'>
                    <span className='bg-lime-500 w-3 h-3 inline-block rounded-full'></span>
                    &nbsp; Bienvenido - {auth?.nombre || 'Usuario'}
                </p>
                <p className='text-green-100 text-center text-sm'>
                    <span className='bg-yellow-500 w-3 h-3 inline-block rounded-full'></span>
                    &nbsp; Rol - {auth?.rol || 'No definido'}
                </p>
                <hr className="mt-5 border-green-600" />

                <ul className="mt-5 space-y-2 text-center">
                    <li>
                        <Link to='/dashboard' className={urlActual === '/dashboard' ? activo : inactivo}>
                            Mi Perfil
                        </Link>
                    </li>

                    {/* Secciones para productores */}
                    {esProductor && (
                        <>
                            <li>
                                <Link to='/dashboard/listar' className={urlActual === '/dashboard/listar' ? activo : inactivo}>
                                    Mis Productos
                                </Link>
                            </li>
                            <li>
                                <Link to='/dashboard/crear' className={urlActual === '/dashboard/crear' ? activo : inactivo}>
                                    Registrar Producto
                                </Link>
                            </li>
                            {/*
                            <li>
                                <Link to='/dashboard/stock' className={urlActual === '/dashboard/stock' ? activo : inactivo}>
                                    Inventario
                                </Link>
                            </li>
                            
                            <li>
                                <Link to='/dashboard/disponibilidad' className={urlActual === '/dashboard/disponibilidad' ? activo : inactivo}>
                                    Calendario de Cosechas
                                </Link>
                            </li>
                            <li>
                                <Link to='/dashboard/ubicacion' className={urlActual === '/dashboard/ubicacion' ? activo : inactivo}>
                                    Mi Finca
                                </Link>
                            </li>*/}
                        </>
                    )}

                    {/* Secciones para clientes */}
                    {!esProductor && (
                        <>
                             <li>
                                <Link to='/dashboard/comprar' className={urlActual === '/dashboard/comprar' ? activo : inactivo}>
                                    Comprar 
                                </Link>
                            </li>
                            <li>
                                <Link to='/dashboard/mis-compras' className={urlActual === '/dashboard/mis-compras' ? activo : inactivo}>
                                    Mis Compras
                                </Link>
                            </li>
                           
                            <li>
                                <Link to='/dashboard/explorar' className={urlActual === '/dashboard/explorar' ? activo : inactivo}>
                                    Explorar Productos
                                </Link>
                            </li>
                            <li>
                                <Link to='/dashboard/soporte' className={urlActual === '/dashboard/soporte' ? activo : inactivo}>
                                    Soporte
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            {/* Main Dashboard */}
            <div className='flex-1 flex flex-col justify-between h-screen bg-green-50'>
                {/* Top Bar */}
                <div className='bg-green-800 py-2 flex md:justify-end items-center gap-5 justify-center'>
                    <div className='text-md font-semibold text-white'>
                        {auth?.rol === "productor" ? "Productor" : "Cliente"} - {auth?.nombre || 'Usuario'}
                    </div>
                    <div>
                        <img src="https://cdn-icons-png.flaticon.com/512/3917/3917132.png" alt="img-user" className="border-2 border-lime-400 rounded-full" width={50} height={50} />
                    </div>
                    <div>
                        <button className='text-white mr-3 text-md block hover:bg-red-900 bg-red-700 px-4 py-1 rounded-lg' onClick={handleExit}>
                            Cerrar sesión
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className='overflow-y-scroll p-8'>
                    {tokenAuth ? <Outlet /> : <Navigate to="/login" />}
                </div>

                {/* Footer */}
                <div className='bg-green-800 h-12'>
                    <p className='text-center text-white leading-[2.9rem] underline'>
                        Plataforma para Pequeños Productores - Todos los derechos reservados
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
