import axios from "axios"
import { createContext, useState } from "react"

// Creación del contexto
const TratamientosContext = createContext()

const TratamientosProvider = ({ children }) => {
  const [modal, setModal] = useState(false)
  const [productos, setTratamientos] = useState([])
  const [productoID, setTatamientoID] = useState(null)

  const handleModal = () => {
    setModal(!modal)
  }

  const handleRegister = async (data) => {
    try {
      const token = localStorage.getItem("token")
      const url = `${import.meta.env.VITE_BACKEND_URL}/producto/registro`
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
      const respuesta = await axios.post(url, data, options)
      setTratamientos([respuesta.data.producto, ...productos])
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async (id, newData) => {
    try {
      const token = localStorage.getItem("token")
      const url = `${import.meta.env.VITE_BACKEND_URL}/producto/${id}`
      const urlP = `${import.meta.env.VITE_BACKEND_URL}/cliente/${newData.cliente}`
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
      await axios.put(url, newData, options)
      const respuesta = await axios.get(urlP, options)
      setTratamientos(respuesta.data.productos)
    } catch (error) {
      console.log(error)
    }
  }

  const handleState = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro que desea dar de baja el producto?")
    if (!confirmacion) return
    try {
      const token = localStorage.getItem("token")
      const url = `${import.meta.env.VITE_BACKEND_URL}/producto/${id}`
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
      const productoBuscar = await axios.get(url, options)
      const producto = productoBuscar.data
      producto.estado = false
      await axios.put(url, producto, options)
      const productosActualizados = productos.filter((p) => p._id !== id)
      setTratamientos(productosActualizados)
    } catch (error) {
      console.log({ respuesta: error.response?.data?.msg, tipo: false })
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token")
      const url = `${import.meta.env.VITE_BACKEND_URL}/productos/eliminar/${id}` // 🔥 corregido
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
      await axios.delete(url, options)
      setTratamientos((prev) => prev.filter((p) => p._id !== id))
    } catch (error) {
      console.log({ respuesta: error.response?.data?.msg, tipo: false })
    }
  }

  return (
    <TratamientosContext.Provider
      value={{
        modal,
        handleModal,
        productos,
        setTratamientos,
        handleRegister,
        handleDelete,
        handleState,
        handleUpdate,
        productoID,
        setTatamientoID,
      }}
    >
      {children}
    </TratamientosContext.Provider>
  )
}

export { TratamientosProvider }
export default TratamientosContext
