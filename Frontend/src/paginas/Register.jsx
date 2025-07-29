import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import Mensaje from '../componets/Alertas'

export const Register = () => {
    const [mensaje, setMensaje] = useState({});
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        email: '',
        password: '',
        rol: 'productor' // Campo rol inicializado
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Formulario enviado:', form);

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/${form.rol}/registro`;
            console.log('Enviando a URL:', url);

            const respuesta = await axios.post(url, form);
            console.log('Respuesta del backend:', respuesta.data);

            // ✅ Guardar rol en localStorage para Confirmar.jsx
            localStorage.setItem("rol", form.rol);

            setMensaje({
                respuesta: respuesta.data.msg,
                tipo: true
            });

            setForm({
                nombre: '',
                apellido: '',
                direccion: '',
                telefono: '',
                email: '',
                password: '',
                rol: 'productor'
            });
        } catch (error) {
            console.error('Error durante el registro:', error.response?.data || error.message);

            setMensaje({
                respuesta: error.response?.data?.msg || error.response?.data?.errors?.[0]?.msg || 'Error desconocido',
                tipo: false
            });
        }
    };

    return (
        <>
            <div className="bg-white flex justify-center items-center w-1/2">
                <div className="md:w-4/5 sm:w-full">
                    {Object.keys(mensaje).length > 0 && (
                        <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
                    )}

                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-green-700">
                        Registro de Usuarios
                    </h1>

                    <small className="text-gray-400 block my-4 text-sm">
                        Elige tu tipo de cuenta e ingresa la información para registrarte
                    </small>

                    <form onSubmit={handleSubmit}>
                        {/* Campo rol */}
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="rol">Tipo de usuario:</label>
                            <select
                                id="rol"
                                name="rol"
                                value={form.rol}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700 py-1 px-1.5 text-gray-500"
                                required
                            >
                                <option value="productor">Productor</option>
                                <option value="cliente">Cliente</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="nombre">Nombre:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                placeholder="Ej. Juan"
                                className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700 py-1 px-1.5 text-gray-500"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="apellido">Apellido:</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={form.apellido}
                                onChange={handleChange}
                                placeholder="Ej. Pérez"
                                className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700 py-1 px-1.5 text-gray-500"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="direccion">Dirección:</label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                value={form.direccion}
                                onChange={handleChange}
                                placeholder="Ej. Comunidad Santa Rosa, Loja"
                                className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700 py-1 px-1.5 text-gray-500"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="telefono">Teléfono:</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={form.telefono}
                                onChange={handleChange}
                                placeholder="Ej. 0991234567"
                                className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700 py-1 px-1.5 text-gray-500"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="email">Correo electrónico:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Ej. productor@email.com"
                                className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700 py-1 px-1.5 text-gray-500"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="password">Contraseña:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="********************"
                                className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700 py-1 px-1.5 text-gray-500"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <button className="bg-green-600 text-white border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-green-800">
                                Registrarse
                            </button>
                        </div>
                    </form>

                    <div className="mt-5 text-xs border-b-2 py-4"></div>

                    <div className="mt-3 text-sm flex justify-between items-center">
                        <p>¿Ya tienes una cuenta?</p>
                        <Link to="/login" className="py-2 px-5 bg-green-600 text-white border rounded-xl hover:scale-110 duration-300 hover:bg-green-800">
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-1/2 h-screen bg-[url('/src/assets/registroagro.png')] bg-no-repeat bg-cover bg-center sm:block hidden"></div>
        </>
    );
};
