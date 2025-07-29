import { Link, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import AuthContext from '../context/AuthProvider'
import Mensaje from '../componets/Alertas'
import axios from 'axios'

const Login = () => {
  const { setAuth } = useContext(AuthContext)

  const [form, setForm] = useState({
    email: "",
    password: "",
    rol: "productor"  // ← Rol por defecto
  })

  const [mensaje, setMensaje] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

   const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/${form.rol}/login` // ← login por rol
      const respuesta = await axios.post(url, {
        email: form.email,
        password: form.password
      })

      // Guardar token y rol
      localStorage.setItem('token', respuesta.data.token)
      localStorage.setItem('rol', respuesta.data.rol)

      // Guardar en contexto
      setAuth(respuesta.data)

      // Redireccionar según el rol
      if (respuesta.data.rol === 'cliente') {
        navigate('/dashboard')
      } else {
        navigate('/dashboard')
      }

    } catch (error) {
      setMensaje({
        respuesta: error.response?.data?.msg || 'Error al iniciar sesión',
        tipo: false
      })
      setTimeout(() => setMensaje({}), 3000)
    }
  }

  return (
    <>
      <div className="w-1/2 h-screen bg-[url('/public/images/loginagro.png')] bg-no-repeat bg-cover bg-center sm:block hidden"></div>

      <div className="w-1/2 h-screen bg-white flex justify-center items-center">
        <div className="md:w-4/5 sm:w-full">
          {Object.keys(mensaje).length > 0 && (
            <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
          )}

          <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-green-600">
            Bienvenido a AgroConecta
          </h1>
          <small className="text-gray-500 block my-4 text-sm text-center">
            Ingresa con tu cuenta de productor o cliente
          </small>

          <form onSubmit={handleSubmit}>
            {/* Rol */}
            <div className="mb-3">
              <label className="block text-sm font-semibold">Tipo de usuario</label>
              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:ring-1 focus:ring-green-700 py-1 px-2 text-gray-700"
              >
                <option value="productor">Productor</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="block text-sm font-semibold">Correo</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:ring-1 focus:ring-green-700 py-1 px-2 text-gray-700"
              />
            </div>

            {/* Contraseña */}
            <div className="mb-3">
              <label className="block text-sm font-semibold">Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********************"
                className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:ring-1 focus:ring-green-700 py-1 px-2 text-gray-700"
              />
            </div>

            <div className="my-4">
              <button className="py-2 w-full bg-green-600 text-white rounded-xl hover:scale-105 duration-300 hover:bg-green-800">
                Iniciar sesión
              </button>
            </div>
          </form>

          <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">O</p>
            <hr className="border-gray-400" />
          </div>

      

          <div className="mt-5 text-xs border-b-2 py-4">
            <Link to="/forgot/id" className="underline text-sm text-gray-400 hover:text-gray-900">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="mt-3 text-sm flex justify-between items-center">
            <p>¿No tienes una cuenta?</p>
            <Link to="/register" className="py-2 px-5 bg-green-600 text-white rounded-xl hover:scale-110 duration-300 hover:bg-green-800">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
