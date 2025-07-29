import { useContext, useEffect, useState } from "react";
import TratamientosContext from "../../context/ProductoProvider";
import axios from "axios"; // Asegúrate de que axios esté importado

const ModalProducto = ({ idPaciente, actualizar }) => {
    console.log(actualizar);
    
    const { handleModal, handleRegister, handleUpdate, setTatamientoID } = useContext(TratamientosContext);
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        prioridad: '',
        cliente: idPaciente
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (actualizar) {
            handleUpdate(idPaciente, form);
        } else {
            handleRegister(form);
        }
        setTatamientoID(null);
        handleModal();
    };

    const handleExit = () => {
        handleModal();
        setTatamientoID(null);
    }

    useEffect(() => {
        if (actualizar) {
            const consultarTratamiento = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const url = `${process.env.VITE_BACKEND_URL}/producto/${idPaciente}`;
                    const options = {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    };
                    const respuesta = await axios.get(url, options);
                    const producto = respuesta.data;
                    console.log(producto);
                    setForm({
                        nombre: producto.nombre,
                        descripcion: producto.descripcion,
                        prioridad: producto.prioridad,
                        cliente: producto.cliente._id
                    });
                } catch (error) {
                    console.log(error);
                }
            };
            consultarTratamiento();
        }
    }, [actualizar, idPaciente]);

    return (
        <div className="lg:w-2/4 lg:h-3/5 bg-gray-800 bg-opacity-100 top-1/4 left-1/3 fixed sticky-0 rounded-lg overflow-y-scroll">
            <p className='text-white uppercase font-bold text-lg text-center mt-4'>Tratamientos</p>
            <form className='p-10' onSubmit={handleSubmit}>
                <div>
                    <label
                        htmlFor='nombre'
                        className='text-white uppercase font-bold text-sm'>Nombre: </label>
                    <input
                        onChange={handleChange}
                        value={form.nombre}
                        id='nombre'
                        type="text"
                        className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                        placeholder='Nombre del producto'
                        name='nombre'
                    />
                </div>
                <div>
                    <label
                        htmlFor='descripcion'
                        className='text-white uppercase font-bold text-sm'>Descripción: </label>
                    <textarea
                        id='descripcion'
                        onChange={handleChange}
                        value={form.descripcion}
                        className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                        placeholder='Descripción del producto'
                        name='descripcion'
                    />
                </div>
                <div>
                    <label
                        htmlFor='prioridad'
                        className='text-white uppercase font-bold text-sm'>Prioridad: </label>
                    <select 
                        onChange={handleChange}
                        value={form.prioridad}
                        name="prioridad"
                        id='prioridad'
                        className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'>
                        <option value="">--- Seleccionar ---</option>
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                    </select> 
                </div>
                <div>
                    <label
                        className='text-white uppercase font-bold text-sm'>ID Paciente: </label>
                    <input
                        type="text"
                        disabled
                        className='border-2 w-full p-2 mt-2 placeholder-gray-200 bg-slate-300 rounded-md mb-5'
                        name='cliente'
                        value={form.cliente}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex justify-center gap-5'>
                    <input
                        type="submit"
                        className='bg-green-700 px-6 text-slate-300 rounded-lg hover:bg-green-900 cursor-pointer'
                        value={actualizar ? 'Actualizar' : 'Registrar'}
                    />
                    <button 
                        type="button"
                        className="sm:w-auto leading-3 text-center text-white px-6 py-4 rounded-lg bg-red-700 hover:bg-red-900"
                        onClick={handleExit}
                    >Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default ModalProducto;