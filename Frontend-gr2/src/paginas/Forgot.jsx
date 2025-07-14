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
            <div className="bg-white flex justify-center items-center w-1/2">
                <div className="md:w-4/5 sm:w-full">
                    {Object.keys(message).length > 0 && <Mensaje tipo={message.tipo}>{message.respuesta}</Mensaje>}

                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-green-700">¡Recupera tu acceso!</h1>
                    <small className="text-gray-500 block my-4 text-sm">
                        Selecciona tu rol e ingresa tu correo para recibir un enlace de recuperación
                    </small>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Tipo de usuario:</label>
                            <select
                                name="rol"
                                value={form.rol}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-300 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 py-1 px-1.5 text-gray-600"
                            >
                                <option value="productor">Productor</option>
                                <option value="cliente">Cliente</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="ejemplo@agrocorreo.com"
                                className="block w-full rounded-md border border-gray-300 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 py-1 px-1.5 text-gray-600"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <button className="bg-green-700 text-white border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-green-900">
                                Enviar correo de recuperación
                            </button>
                        </div>
                    </form>

                    <div className="mt-5 text-xs border-b-2 py-4 "></div>

                    <div className="mt-3 text-sm flex justify-between items-center">
                        <p>¿Ya recordaste tu contraseña?</p>
                        <Link
                            to="/login"
                            className="py-2 px-5 bg-green-600 text-white border rounded-xl hover:scale-110 duration-300 hover:bg-green-900"
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-1/2 h-screen bg-[url('/src/assets/recuperaragro.png')] 
                bg-no-repeat bg-cover bg-center sm:block hidden">
            </div>
        </>
    )
}
