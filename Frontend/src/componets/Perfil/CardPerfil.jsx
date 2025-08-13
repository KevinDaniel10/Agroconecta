import { useContext } from "react"
import AuthContext from "../../context/AuthProvider"

export const CardPerfil = () => {
    const { auth } = useContext(AuthContext)
    console.log(auth)
    
return (
  <main className="w-full bg-green-50">
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
      {/* Título */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green-900">
          Perfil del productor
        </h1>
        <p className="mt-2 text-sm sm:text-base text-green-900/70">
          Este módulo te permite visualizar y editar tu perfil como productor agrícola.
        </p>
      </div>

      {/* Contenido: dos columnas en xl. El FORM queda **más angosto** */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* IZQ: FORM – reducido */}
        <section className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-4 sm:p-6">
          {/* Contenedor que limita el ancho del formulario */}
          <div className="w-full max-w-md sm:max-w-lg mx-auto text-sm sm:text-base space-y-4">
            {/* === PEGA AQUÍ TU FORM ACTUAL SIN CAMBIAR LÓGICA ===
                 (inputs, labels, botones, handlers) */}
            {/** EJEMPLO:
             * <form onSubmit={handleSubmit}> ... </form>
             */}
            {formMarkup /* <-- deja tu JSX de formulario aquí */}
          </div>
        </section>

        {/* DER: panel/preview (sin cambios) */}
        <aside className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-4 sm:p-6">
          {panelDerecho /* tu contenido actual del panel derecho */}
        </aside>
      </div>
    </div>
  </main>
)

}
