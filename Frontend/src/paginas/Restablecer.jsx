import logoDog from '../assets/logoa.png'
import Mensaje from '../componets/Alertas'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Restablecer = () => {
    const { token, rol } = useParams() // Captura dinámica del token y rol
    const navigate = useNavigate()

    const [mensaje, setMensaje] = useState({})
    const [tokenValido, setTokenValido] = useState(false)
    const [form, setForm] = useState({
        password: "",
        confirmpassword: ""
    })

    // Verificar token al montar el componente
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/${rol}/comprobar-token/${token}`
                const { data } = await axios.get(url)
                setTokenValido(true)
                setMensaje({ respuesta: data.msg, tipo: true })
            } catch (error) {
                console.error("Error verificando token:", error)
                setMensaje({
                    respuesta: error.response?.data?.msg || "Token inválido o expirado",
                    tipo: false
                })
            }
        }
        verifyToken()
    }, [token, rol])

    // Actualizar estado del formulario
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // Enviar nueva contraseña
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/${rol}/nuevo-password/${token}`
            const respuesta = await axios.post(url, form)
            setMensaje({ respuesta: respuesta.data.msg, tipo: true })
            setForm({ password: "", confirmpassword: "" })

            setTimeout(() => navigate('/login'), 3000)
        } catch (error) {
            console.error("Error actualizando contraseña:", error)
            setMensaje({
                respuesta: error.response?.data?.msg || "Error al actualizar la contraseña",
                tipo: false
            })
        }
    }

   return (
  <div className="w-screen min-h-screen flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
      {Object.keys(mensaje).length > 0 && (
        <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
      )}

      <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center uppercase text-gray-600">
        Restablecer Contraseña
      </h1>
      <small className="block mb-4 text-xs sm:text-sm text-gray-400 text-center">
        Ingresa y confirma tu nueva contraseña
      </small>

      <img
        className="mx-auto object-cover w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full border-4 border-gray-500 mb-6"
        src={logoDog}
        alt="Recuperación"
      />

      {tokenValido && (
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Nueva Contraseña
            </label>
            <input
              type="password"
              name="password"
              placeholder="Nueva contraseña"
              value={form.password}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 py-2 px-3 text-gray-700 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              name="confirmpassword"
              placeholder="Confirmar contraseña"
              value={form.confirmpassword}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 py-2 px-3 text-gray-700 text-sm sm:text-base"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-xl hover:scale-[1.02] sm:hover:scale-105 duration-300 hover:bg-green-800 active:bg-green-900 text-sm sm:text-base"
          >
            Actualizar Contraseña
          </button>
        </form>
      )}
    </div>
  </div>
)

}

export default Restablecer
