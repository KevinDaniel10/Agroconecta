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
        <div className={darkMode ? "dark" :""}>
  <main className='bg-white px-10 md:px-20 lg:px-40 dark:bg-gray-800'>
    <section>
      <nav className='p-10 mb-12 flex justify-between'>
        <h1 className='text-2xl font-bold dark:text-white'>AgroConecta</h1>
        <ul className='flex items-center'>
          <li>
            <img onClick={() => setdarkMode(!darkMode)} className='cursor-pointer' src={logoDarkMode} alt="logo" width={40} height={40} />
          </li>
          <li>
            <Link to="/login" className='bg-green-600 text-white px-6 py-2 rounded-full ml-8 hover:bg-green-800'>
              Iniciar sesión
            </Link>
          </li>
        </ul>
      </nav>

      <div className='text-center'>
        <h2 className='text-5xl py-2 text-green-600 font-medium md:text-6xl'>Conectamos al campo con la ciudad</h2>
        <h3 className='text-2xl py-2 md:text-3xl dark:text-white'>Soluciones digitales para pequeños productores</h3>
        <p className='text-md py-5 leading-8 text-gray-800 md:text-xl max-w-lg mx-auto dark:text-white'>
          AgroConecta es una plataforma pensada para ayudar a pequeños agricultores a ofrecer y distribuir sus productos usando tecnología accesible y geolocalización.
        </p>
      </div>
    </section>

    <section>
      <div>
        <h3 className='text-3xl py-1 dark:text-white'>Servicios disponibles</h3>
        <p className='text-md py-2 leading-8 text-gray-800 dark:text-white'>
          Nuestra app ayuda a <span className='text-green-600'>productores rurales</span> a comercializar sus productos de manera directa, sin intermediarios. Usamos mapas interactivos y un sistema de pedidos.
        </p>
      </div>

      <div className='md:flex md:flex-wrap lg:flex lg:justify-center gap-10'>
        <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96 dark:bg-slate-100'>
          <img className='mx-auto' src={logoCode} alt="" />
          <h3 className='text-lg font-medium pt-8 pb-2'>Mapa de productores</h3>
          <p className='py-4 text-green-600'>
            Visualiza y contacta productores cercanos según tu ubicación.
          </p>
        </div>

        <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96 dark:bg-slate-300'>
          <img className='mx-auto' src={logoConsulting} alt="" />
          <h3 className='text-lg font-medium pt-8 pb-2'>Pedidos en línea</h3>
          <p className='py-4 text-green-600'>
            Permite que clientes o comercios realicen pedidos directamente desde la app.
          </p>
        </div>

        <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96 dark:bg-slate-100'>
          <img className='mx-auto' src={logoDesign} alt="" />
          <h3 className='text-lg font-medium pt-8 pb-2'>Promoción de productos</h3>
          <p className='py-4 text-green-600'>
            Sube fotos, precios y disponibilidad de tus productos de forma sencilla.
          </p>
        </div>
      </div>
    </section>

    
  </main>
</div>

    )
}