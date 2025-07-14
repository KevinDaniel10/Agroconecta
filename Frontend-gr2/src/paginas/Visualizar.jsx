import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import axios from 'axios';
import Mensaje from '../componets/Alertas';
import ModalProducto from '../componets/Modals/ModalProducto';
import TratamientosContext from '../context/ProductoProvider';
import TablaProductos from '../componets/TablaProductos';

const Visualizar = () => {
    const { id } = useParams()
    const { auth } = useContext(AuthContext)
    const {modal, handleModal, productos, setTratamientos, productoID} = useContext(TratamientosContext);

    const [cliente, setPaciente] = useState({})
    const [mensaje, setMensaje] = useState({})

    const formatearFecha = (fecha) => {
        const nuevaFecha = new Date(fecha)
			nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
        return new Intl.DateTimeFormat('es-EC',{dateStyle:'long'}).format(nuevaFecha)
    }

    useEffect(() => {
        const consultarPaciente = async () => {
            try {
                const token = localStorage.getItem('token')
                const url = `${process.env.VITE_BACKEND_URL}/cliente/${id}`
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
                const respuesta = await axios.get(url, options)
                setPaciente(respuesta.data.cliente)
                setTratamientos(respuesta.data.productos)
            } catch (error) {
                setMensaje({ respuesta: error.response.data.msg, tipo: false })
            }
        }
        consultarPaciente();
    }, [])

    return (
        <>
            <div>
                <h1 className='font-black text-4xl text-gray-500'>Visualizar Paciente</h1>
                <hr className='my-4' />
                
            </div>
            <div>
                {
                    Object.keys(cliente).length != 0 ?
                        (
                            <>
                            <div className='m-5 flex justify-between'>
                                <div>
                                    <p className="text-md text-gray-00 mt-4">
                                        <span className="text-gray-600 uppercase font-bold">* Nombre del cliente: </span>
                                        {cliente.nombre}
                                    </p>
                                    <p className="text-md text-gray-00 mt-4">
                                        <span className="text-gray-600 uppercase font-bold">* Nombre del propietario: </span>
                                        {cliente.propietario}
                                    </p>
                                    <p className="text-md text-gray-00 mt-4">
                                        <span className="text-gray-600 uppercase font-bold">* Email: </span>
                                        {cliente.email}
                                    </p>
                                    <p className="text-md text-gray-00 mt-4">
                                        <span className="text-gray-600 uppercase font-bold">* Fecha de atención: </span>
                                        {formatearFecha(cliente.ingreso)}
                                    </p>
                                    <p className="text-md text-gray-00 mt-4">
                                        <span className="text-gray-600 uppercase font-bold">* Fecha de salida: </span>
                                        {formatearFecha(cliente.salida)}
                                    </p>
                                    <p className="text-md text-gray-00 mt-4">
                                        <span className="text-gray-600 uppercase font-bold">* Estado: </span>
                                        <span className="bg-blue-100 text-green-500 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{cliente.estado && "activo"}</span>
                                    </p>
                                    <p className="text-md text-gray-00 mt-4">
                                        <span className="text-gray-600 uppercase font-bold">* Síntomas: </span>
                                        {cliente.sintomas}
                                    </p>
                                </div>
                                <div>
                                    <img src="https://cdn-icons-png.flaticon.com/512/2138/2138440.png" alt="dogandcat" className='h-80 w-80' />
                                </div>
                            </div>
                            </>
                        )
                        :
                        (
                            Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
                        )
                }
            </div>
            <hr className='my-4' />
            <div>
                <p className='mb-8'>Este submódulo te permite visualizar los datos del cliente</p>
                {
                    auth.rol == "productor" && (
                        <>
                            <button
                                className="sm:w-auto leading-3 text-center text-white px-6 py-4 rounded-lg bg-blue-700 hover:bg-blue-900" 
                                onClick={handleModal}
                            >Registrar</button>
                        </>
                    )
                }
                {
                    modal && productoID === null && (
                        <ModalProducto idPaciente={cliente?._id} actualizar={false} />
                    )
                }
                {
                    productos.length == 0 ? 
                    <Mensaje tipo={"Active"}>{"No existen registros"}</Mensaje>
                    :
                    <TablaProductos productos={productos}/>
                }
            </div>
        </>
    )
}

export default Visualizar