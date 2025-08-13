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
    {/* SIN márgenes blancos: la grid ocupa todo el ancho y alto */}
    <div className="w-screen min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Columna formulario (ocupa toda su mitad) */}
      <div className="flex items-center justify-center bg-white px-6 md:px-12 py-8">
        <div className="w-full max-w-xl">
          {Object.keys(mensaje).length > 0 && (
            <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
          )}

          <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center uppercase text-green-700">
            Registro de Usuarios
          </h1>

          <small className="block my-3 sm:my-4 text-xs sm:text-sm text-gray-400 text-center">
            Elige tu tipo de cuenta e ingresa la información para registrarte
          </small>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Campo rol */}
            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="rol">Tipo de usuario:</label>
              <select
                id="rol"
                name="rol"
                value={form.rol}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:ring-1 focus:ring-green-700 py-2 px-3 text-gray-500 text-sm sm:text-base"
                required
              >
                <option value="productor">Productor</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>

            {/* Nombre */}
            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan"
                className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:ring-1 focus:ring-green-700 py-2 px-3 text-gray-500 text-sm sm:text-base"
                required
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="apellido">Apellido:</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Ej. Pérez"
                className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:ring-1 focus:ring-green-700 py-2 px-3 text-gray-500 text-sm sm:text-base"
                required
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="direccion">Dirección:</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Ej. Comunidad Santa Rosa, Loja"
                className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:ring-1 focus:ring-green-700 py-2 px-3 text-gray-500 text-sm sm:text-base"
                required
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="telefono">Teléfono:</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Ej. 0991234567"
                className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:ring-1 focus:ring-green-700 py-2 px-3 text-gray-500 text-sm sm:text-base"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="email">Correo electrónico:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Ej. productor@email.com"
                className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:ring-1 focus:ring-green-700 py-2 px-3 text-gray-500 text-sm sm:text-base"
                required
              />
            </div>

            {/* Contraseña (con ojito para ver/ocultar) */}
            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="password">Contraseña:</label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********************"
                  className="block w-full rounded-md border border-gray-300 focus:border-green-700 focus:ring-1 focus:ring-green-700 py-2 px-3 pr-10 text-gray-500 text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  aria-label="Mostrar u ocultar contraseña"
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    const el = document.getElementById('password');
                    if (el) el.type = el.type === 'password' ? 'text' : 'password';
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" />
                    <circle cx="12" cy="12" r="3" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Botón */}
            <div>
              <button className="bg-green-600 text-white py-2 w-full rounded-xl mt-5 hover:scale-[1.02] sm:hover:scale-105 duration-300 hover:bg-green-700 active:bg-green-800 text-sm sm:text-base">
                Registrarse
              </button>
            </div>
          </form>

          <div className="mt-5 text-xs sm:text-sm border-b-2 py-3 sm:py-4" />

          <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <p className="text-center sm:text-left">¿Ya tienes una cuenta?</p>
            <Link
              to="/login"
              className="w-full sm:w-auto text-center py-2 px-5 bg-green-600 text-white rounded-xl hover:scale-105 duration-300 hover:bg-green-700 active:bg-green-800"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Columna imagen — llena COMPLETAMENTE su mitad (sin bordes blancos) */}
      <img
        src="/registroagro.png"
        alt=""
        className="hidden md:block w-full h-full object-cover"
        aria-hidden="true"
      />
    </div>
  </>
)




};
