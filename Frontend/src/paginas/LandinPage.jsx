import logoDarkMode from '../assets/dark.png'
import logoFacebook from '../assets/facebook.png'
import logoGithub from '../assets/github.png'
import logoLinkedind from '../assets/linkedin.png'
import logoRocket from '../assets/rocket.webp'
import logoCode from '../assets/code.png'
import logoConsulting from '../assets/consulting.png'
import logoDesign from '../assets/design.png'
import logoWeb1 from '../assets/web1.png'
import logoWeb2 from '../assets/web2.png'
import logoWeb3 from '../assets/web3.png'
import logoWeb4 from '../assets/web4.png'
import logoWeb5 from '../assets/web5.png'
import logoWeb6 from '../assets/web6.png'
import { useState } from 'react'
import {Link} from 'react-router-dom'


export const LandinPage = () => {
    const [darkMode, setdarkMode] = useState(false)
    return (
  <div className={darkMode ? "dark" : ""}>
    <main className="bg-white dark:bg-gray-900 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40">
      {/* NAV */}
      <section>
        <nav className="py-4 sm:py-6 mb-8 sm:mb-12 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold dark:text-white">
            AgroConecta
          </h1>
          <ul className="flex items-center gap-3 sm:gap-4">
            <li>
              <img
                onClick={() => setdarkMode(!darkMode)}
                className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10"
                src={logoDarkMode}
                alt="Cambiar modo oscuro"
                width={40}
                height={40}
              />
            </li>
            <li>
              <Link
                to="/login"
                className="inline-flex items-center justify-center bg-green-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-green-700 active:bg-green-800 transition-colors text-sm sm:text-base"
              >
                Iniciar sesión
              </Link>
            </li>
          </ul>
        </nav>

        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl py-2 text-green-600 font-semibold">
            Conectamos al campo con la ciudad
          </h2>
          <h3 className="text-lg sm:text-xl md:text-2xl py-2 dark:text-white">
            Soluciones digitales para pequeños productores
          </h3>
          <p className="text-base sm:text-lg md:text-xl py-5 leading-7 sm:leading-8 text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
            AgroConecta es una plataforma pensada para ayudar a pequeños
            agricultores a ofrecer y distribuir sus productos usando
            tecnología accesible y geolocalización.
          </p>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="mt-6 sm:mt-10">
        <div className="max-w-3xl">
          <h3 className="text-2xl sm:text-3xl py-1 dark:text-white">
            Servicios disponibles
          </h3>
          <p className="text-base sm:text-lg py-2 leading-7 sm:leading-8 text-gray-700 dark:text-gray-200">
            Nuestra app ayuda a{" "}
            <span className="text-green-600">productores rurales</span> a
            comercializar sus productos de manera directa, sin
            intermediarios. Usamos mapas interactivos y un sistema de
            pedidos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 mt-6">
          {/* Card 1 */}
          <div className="text-center shadow-xl p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-100 dark:ring-gray-700 hover:shadow-2xl transition-shadow">
            <img
              className="mx-auto max-w-[120px] sm:max-w-[140px] h-auto"
              src={logoCode}
              alt="Mapa de productores"
            />
            <h3 className="text-base sm:text-lg font-medium pt-6 pb-2 dark:text-white">
              Mapa de productores
            </h3>
            <p className="py-2 sm:py-4 text-green-600 text-sm sm:text-base">
              Visualiza y contacta productores cercanos según tu ubicación.
            </p>
          </div>

          {/* Card 2 */}
          <div className="text-center shadow-xl p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-100 dark:ring-gray-700 hover:shadow-2xl transition-shadow">
            <img
              className="mx-auto max-w-[120px] sm:max-w-[140px] h-auto"
              src={logoConsulting}
              alt="Pedidos en línea"
            />
            <h3 className="text-base sm:text-lg font-medium pt-6 pb-2 dark:text-white">
              Pedidos en línea
            </h3>
            <p className="py-2 sm:py-4 text-green-600 text-sm sm:text-base">
              Permite que clientes o comercios realicen pedidos directamente
              desde la app.
            </p>
          </div>

          {/* Card 3 */}
          <div className="text-center shadow-xl p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-100 dark:ring-gray-700 hover:shadow-2xl transition-shadow">
            <img
              className="mx-auto max-w-[120px] sm:max-w-[140px] h-auto"
              src={logoDesign}
              alt="Promoción de productos"
            />
            <h3 className="text-base sm:text-lg font-medium pt-6 pb-2 dark:text-white">
              Promoción de productos
            </h3>
            <p className="py-2 sm:py-4 text-green-600 text-sm sm:text-base">
              Sube fotos, precios y disponibilidad de tus productos de forma
              sencilla.
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
);
}