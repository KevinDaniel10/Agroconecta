import axios from "axios"
import { createContext, useState } from "react"

// Creacion de un contexto para los productos
const TratamientosContext = createContext()

// Proveedor de los productos
const TratamientosProvider = ({ children }) => {
    const [modal, setModal] = useState(false)
    const [productos, setTratamientos] = useState([])
    const [productoID, setTatamientoID] = useState(null);

    const handleModal = () => {
        setModal(!modal);
    };

    const handleRegister = async (data) => {
        try {
            const token = localStorage.getItem('token')
            const url = `${process.env.VITE_BACKEND_URL}/producto/registro`
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const respuesta = await axios.post(url, data, options);
            setTratamientos([respuesta.data.producto, ...productos]);
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdate = async (id, newData) => {
        try {
            const token = localStorage.getItem('token')
            const url = `${process.env.VITE_BACKEND_URL}/producto/${id}`
            const urlP = `${process.env.VITE_BACKEND_URL}/cliente/${newData.cliente}`
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            await axios.put(url, newData, options);
            const respuesta = await axios.get(urlP, options)
            console.warn("Tratamientos", respuesta.data.productos)
            setTratamientos(respuesta.data.productos)
        } catch (error) {
            console.log(error);
        }
    }

    const handleState = async (id) => {
        const confirmacion = window.confirm('¿Estás seguro que desea dar de baja el producto?')
        if (!confirmacion) return
        try {
            const token = localStorage.getItem('token')
            const url = `${process.env.VITE_BACKEND_URL}/producto/${id}`
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const productoBuscar = await axios.get(url, options)
            const producto = productoBuscar.data
            producto.estado = false
            console.log(producto)
            const respuesta = await axios.put(url, producto, options)
            const productosActualizados = productos.filter(producto => producto._id !== id)
            setTratamientos(productosActualizados)
            console.log(respuesta.data)
        } catch (error) {
            console.log({ respuesta: error.response.data.msg, tipo: false })
        }
        console.log(id)
    }

    const handleDelete = async (id) => {
        const confirmacion = window.confirm('¿Estás seguro de eliminar el producto?')
        if (!confirmacion) return
        try {
            const token = localStorage.getItem('token')
            const url = `${process.env.VITE_BACKEND_URL}/producto/${id}`
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const respuesta = await axios.delete(url, options)
            const productoFiltrado = productos.filter(producto => producto._id !== id)
            setTratamientos(productoFiltrado)
            
        } catch (error) {
            console.log({ respuesta: error.response.data.msg, tipo: false })
        }
    }
    
    return (
        <TratamientosContext.Provider value={
            {
                modal,
                handleModal,
                productos,
                setTratamientos,
                handleRegister,
                handleDelete,
                handleState,
                handleUpdate,
                productoID,
                setTatamientoID
            }
        }>
            {children}
        </TratamientosContext.Provider>
    )
}

// Exportacion de los componentes
export {
    TratamientosProvider
}
export default TratamientosContext