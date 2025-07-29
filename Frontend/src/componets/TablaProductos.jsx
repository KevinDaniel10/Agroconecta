import { useContext } from "react";
import {
  MdDeleteForever,
  MdOutlineSecurityUpdateGood,
  MdPublishedWithChanges,
} from "react-icons/md";
import TratamientosContext from "../context/ProductoProvider";
import AuthContext from "../context/AuthProvider";
import ModalProducto from "./Modals/ModalProducto";

const TablaProductos = ({ productos }) => {
  const {
    handleDelete,
    handleState,
    modal,
    handleModal,
    productoID,
    setTatamientoID,
  } = useContext(TratamientosContext);

  const { auth } = useContext(AuthContext);

  const handleUpdate = (id) => {
    setTatamientoID(id);
    handleModal();
  };

  return (
    <>
      <div className="overflow-auto">
        <table className="w-full mt-5 table-auto shadow-lg bg-white">
          <thead className="bg-gray-800 text-slate-200 text-sm">
            <tr>
              <th className="p-2">N°</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">Imagen</th>
              <th className="p-2">Prioridad</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr
                className="border-b hover:bg-gray-100 text-center text-sm"
                key={producto._id}
              >
                <td>{index + 1}</td>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>
                  {producto.imagen ? (
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${producto.imagen}`}
                      alt={producto.nombre}
                      className="w-20 h-20 object-cover mx-auto rounded"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">Sin imagen</span>
                  )}
                </td>
                <td>{producto.prioridad}</td>
                <td>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${producto.estado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {producto.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  {auth.rol === "productor" && (
                    <div className="flex justify-center items-center gap-2">
                      <MdPublishedWithChanges
                        title="Editar"
                        className="h-6 w-6 text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => handleUpdate(producto._id)}
                      />
                      <MdOutlineSecurityUpdateGood
                        title="Cambiar estado"
                        className="h-6 w-6 text-yellow-600 hover:text-yellow-800 cursor-pointer"
                        onClick={() => handleState(producto._id)}
                      />
                      <MdDeleteForever
                        title="Eliminar"
                        className="h-7 w-7 text-red-600 hover:text-red-800 cursor-pointer"
                        onClick={() => {
                          if (
                            window.confirm(
                              `¿Estás seguro de eliminar "${producto.nombre}"?`
                            )
                          ) {
                            handleDelete(producto._id);
                          }
                        }}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && productoID && (
        <ModalProducto idPaciente={productoID} actualizar={true} />
      )}
    </>
  );
};

export default TablaProductos;
