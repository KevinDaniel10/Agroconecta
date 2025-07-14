import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever, MdNoteAdd, MdInfo } from "react-icons/md";
import axios from 'axios';
import Mensaje from "./Alertas";
import AuthContext from "../context/AuthProvider";

const Tabla = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext)

    const [clientes, setPacientes] = useState([])
    
    const listarPacientes = async () => {
        try {
            const token = localStorage.getItem('token')
            const url = `${process.env.VITE_BACKEND_URL}/clientes`
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const respuesta = await axios.get(url, options)
            setPacientes(respuesta.data, ...clientes)
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async (id) => {
        try {
            const conformar = confirm('¿Está seguro de eliminar el registro?')
            if (!conformar) {
                return
            }
            const token = localStorage.getItem('token')
            const url = `${process.env.VITE_BACKEND_URL}/cliente/eliminar/${id}`
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }

            const data = {
                salida: new Date().toISOString(),
            }

            const respuesta = await axios.delete(url, {headers, data})
            await listarPacientes();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        listarPacientes()
    }, [])


    return (
        <>
            {
                clientes.length == 0
                    ?
                    <Mensaje tipo={'active'}>{'No existen registros'}</Mensaje>
                    :
                    <table className='w-full mt-5 table-auto shadow-lg  bg-white'>
                        <thead className='bg-gray-800 text-slate-400'>
                            <tr>                                
                                <th className='p-2'>N°</th>
                                <th className='p-2'>Nombre</th>
                                <th className='p-2'>Propietario</th>
                                <th className='p-2'>Email</th>
                                <th className='p-2'>Celular</th>
                                <th className='p-2'>Estado</th>
                                <th className='p-2'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                clientes.map((cliente, index) => (
                                    <tr className="border-b hover:bg-gray-300 text-center" key={cliente._id}>
                                        <td>{index + 1}</td>
                                        <td>{cliente.nombre}</td>
                                        <td>{cliente.propietario}</td>
                                        <td>{cliente.email}</td>
                                        <td>{cliente.celular}</td>
                                        <td>
                                            <span className="bg-blue-100 text-green-500 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{cliente.estado && "activo"}</span>
                                        </td>
                                        <td className='py-2 text-center'>
                                            <MdNoteAdd 
                                                className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                                                onClick={() => navigate(`/dashboard/visualizar/${cliente._id}`)}
                                            />
                                            {
                                                auth.rol === "productor" && (
                                                    <>
                                                        <MdInfo
                                                            className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                                                            onClick={() => navigate(`/dashboard/actualizar/${cliente._id}`)}
                                                        />
            
                                                        <MdDeleteForever 
                                                            className="h-7 w-7 text-red-900 cursor-pointer inline-block"
                                                            onClick={() => handleDelete(cliente._id)}
                                                        />
                                                    </>
                                                )
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
            }
        </>

    )
}

export default Tabla