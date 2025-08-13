import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import Mensaje from '../componets/Alertas'

export const Forgot = () => {
    const [form, setForm] = useState({ email: '', rol: 'productor' })
    const [message, setMessage] = useState('')

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/${form.rol}/recuperar-password`
            const respuesta = await axios.post(url, { email: form.email })
            setMessage({ respuesta: respuesta.data.msg, tipo: true })
            setForm({ email: '', rol: form.rol })
        } catch (error) {
            setMessage({ respuesta: error.response?.data?.msg || 'Error al enviar el correo', tipo: false })
        }
    }

   return (
  <>
    {/* Layout responsive: 1 columna en móvil, 2 columnas desde md, SIN márgenes blancos */}
    <div className="w-screen min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Columna formulario */}
      <div className="flex justify-center items-center bg-white px-6 md:px-12 py-8">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
          {Object.keys(message).length > 0 && (
            <Mensaje tipo={message.tipo}>{message.respuesta}</Mensaje>
          )}

          <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center uppercase text-green-700">
            ¡Recupera tu acceso!
          </h1>
          <small className="block my-3 sm:my-4 text-xs sm:text-sm text-gray-500 text-center">
            Selecciona tu rol e ingresa tu correo para recibir un enlace de recuperación
          </small>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold">Tipo de usuario:</label>
              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 py-2 px-3 text-gray-600 text-sm sm:text-base"
              >
                <option value="productor">Productor</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ejemplo@agrocorreo.com"
                className="block w-full rounded-md border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 py-2 px-3 text-gray-600 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <button className="bg-green-700 text-white py-2 w-full rounded-xl mt-5 hover:scale-[1.02] sm:hover:scale-105 duration-300 hover:bg-green-800 active:bg-green-900 text-sm sm:text-base">
                Enviar correo de recuperación
              </button>
            </div>
          </form>

          <div className="mt-5 text-xs sm:text-sm border-b-2 py-3 sm:py-4" />

          <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <p className="text-center sm:text-left">¿Ya recordaste tu contraseña?</p>
            <Link
              to="/login"
              className="w-full sm:w-auto text-center py-2 px-5 bg-green-600 text-white rounded-xl hover:scale-105 duration-300 hover:bg-green-800 active:bg-green-900"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Columna imagen: llena completamente su mitad, sin espacios */}
      <img
        src="/src/assets/recuperaragro.png"
        alt=""
        className="hidden md:block w-full h-full object-cover"
        aria-hidden="true"
      />
    </div>
  </>
)

}
