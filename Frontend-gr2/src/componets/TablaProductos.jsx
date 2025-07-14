import { useContext, useState } from "react";
import { MdDeleteForever, MdOutlineSecurityUpdateGood, MdPublishedWithChanges } from "react-icons/md";
import TratamientosContext from "../context/ProductoProvider";
import AuthContext from "../context/AuthProvider";
import ModalProducto from "./Modals/ModalProducto";

const TablaProductos = ({productos}) => {
    const { handleDelete, handleState, modal, handleModal, productoID, setTatamientoID } = useContext(TratamientosContext);
    
    const { auth } = useContext(AuthContext);
    console.log(productos)

    const handleUpdate = (id) => {
        setTatamientoID(id);
        handleModal();
    }

    return (
        <>
        <table className='w-full mt-5 table-auto shadow-lg  bg-white'>
            <thead className='bg-gray-800 text-slate-400'>
                <tr>
                    <th className='p-2'>N°</th>
                    <th className='p-2'>Nombre</th>
                    <th className='p-2'>Descripción</th>
                    <th className='p-2'>Prioridad</th>
                    <th className='p-2'>Estado</th>
                    <th className='p-2'>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {
                    productos.map((producto, index) => (
                        <tr className="border-b hover:bg-gray-300 text-center" key={producto._id}>
                            <td>{index + 1}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.descripcion}</td>
                            <td>{producto.prioridad}</td>
                            <td>
                                <span className="bg-blue-100 text-green-500 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{producto.estado && "activo"}</span>
                            </td>
                            <td className='py-2 text-center'>
                            {
                                auth.rol === "productor" && (
                                    <>
                                        <MdPublishedWithChanges 
                                            className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                                            onClick={() => handleUpdate(producto._id)}
                                        />
                            
                                        <MdOutlineSecurityUpdateGood 
                                            className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                                            onClick={() => handleState(producto._id)}
                                        />

                                        <MdDeleteForever 
                                            className="h-8 w-8 text-red-900 cursor-pointer inline-block"
                                            onClick={() => handleDelete(producto._id)}
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
        {
            modal && productoID && (
                <ModalProducto idPaciente={productoID} actualizar={true} />
            )
        }
        </>
    )
}

export default TablaProductos