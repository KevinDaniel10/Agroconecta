import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Mensaje from "../componets/Alertas";
import { jwtDecode } from "jwt-decode";

import FormularioPerfil from "../componets/Perfil/FormularioPerfil";

const Actualizar = () => {
  const { id } = useParams();
  const [mensaje, setMensaje] = useState({});
  const [usuario, setUsuario] = useState({});
  const [rol, setRol] = useState("");

  useEffect(() => {
    const consultarUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token");

        const decoded = jwtDecode(token);
        setRol(decoded.rol);

        const endpoint =
          decoded.rol === "cliente"
            ? `/cliente/actualiza/${id}`
            : `/productor/actualizar/${id}`;

        const url = `${import.meta.env.VITE_BACKEND_URL}${endpoint}`;
        const options = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const respuesta = await axios.get(url, options);
        setUsuario(respuesta.data);
      } catch (error) {
        console.log(error);
        setMensaje({
          respuesta: error.response?.data?.msg || "Error al consultar los datos",
          tipo: false,
        });
      }
    };

    consultarUsuario();
  }, [id]);

  return (
    <div>
      <h1 className="font-black text-4xl text-gray-600">Actualizar perfil</h1>
      <hr className="my-4" />
      <p className="mb-8">
        Este módulo te permite editar el perfil del {rol || "usuario"}
      </p>

      {Object.keys(usuario).length !== 0 ? (
        <FormularioPerfil usuario={usuario} rol={rol} />
      ) : (
        Object.keys(mensaje).length > 0 && (
          <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
        )
      )}
    </div>
  );
};

export default Actualizar;
