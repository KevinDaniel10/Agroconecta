import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import FormularioPerfil from '../componets/Perfil/FormularioPerfil';

const Perfil = () => {
  const { auth } = useContext(AuthContext);
  const esCliente = auth?.rol === "cliente";
  const esProductor = auth?.rol === "productor";

  return (
   <div className="max-w-6xl mx-auto mt-10 px-6">
  <div className="text-center">
    <h1 className="font-black text-4xl text-green-800 mb-2">
      Perfil del {esCliente ? "cliente" : "productor"}
    </h1>
    <hr className="my-4 border-green-300" />
    <p className="mb-8 text-gray-600 text-base">
      Este módulo te permite visualizar y editar tu perfil como {esCliente ? "cliente comprador" : "productor agrícola"}.
    </p>
  </div>
    <FormularioPerfil />
</div>


  );
};

export default Perfil;
