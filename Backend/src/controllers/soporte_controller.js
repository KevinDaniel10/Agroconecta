import Soporte from "../models/Soporte.js"
import Cliente from '../models/Cliente.js';
import Productores from '../models/Productor.js';
import { sendMailRespuestaSoporte } from '../config/nodemailer.js';

// YA EXISTENTE
const enviarMensaje = async (req, res) => {
  const { mensaje } = req.body;

  if (!mensaje) {
    return res.status(400).json({ msg: "El mensaje no puede estar vacío" });
  }

  try {
    // Convertir el rol al formato que espera el enum
    let rolConvertido = "";
    if (req.usuario.rol === "cliente") rolConvertido = "Cliente";
    else if (req.usuario.rol === "productor") rolConvertido = "Productores";

    const nuevoMensaje = new Soporte({
      mensaje,
      usuario: req.usuario._id,
      rol: rolConvertido,
    });

    await nuevoMensaje.save();
    res.json({ msg: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ msg: "Hubo un error al enviar el mensaje" });
  }
};
// NUEVO – obtener todos los mensajes
const obtenerMensajes = async (req, res) => {
  try {
    const mensajes = await Soporte.find()
      .populate("usuario", "nombre apellido")
      .sort({ createdAt: -1 });

    res.json(mensajes);
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    res.status(500).json({ msg: "Error al obtener mensajes" });
  }
};

// NUEVO – marcar como leído
const marcarComoLeido = async (req, res) => {
  try {
    const soporte = await Soporte.findByIdAndUpdate(
      req.params.id,
      { leido: true },
      { new: true }
    );

    if (!soporte) {
      return res.status(404).json({ msg: "Mensaje no encontrado" });
    }

    res.json({ msg: "Mensaje marcado como leído", soporte });
  } catch (error) {
    console.error("Error al actualizar mensaje:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};
// src/controllers/soporte_controller.js
const marcarComoSolucionado = async (req, res) => {
  const { id } = req.params;

  try {
    const soporte = await Soporte.findById(id);
    if (!soporte) return res.status(404).json({ msg: "Mensaje no encontrado" });

    soporte.solucionado = true;
    await soporte.save();

    res.json({ msg: "Mensaje marcado como solucionado" });
  } catch (error) {
    console.error("Error al marcar como solucionado:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

const responderMensaje = async (req, res) => {
  const { id } = req.params;
  const { mensaje } = req.body;

  if (!mensaje) {
    return res.status(400).json({ msg: "La respuesta no puede estar vacía" });
  }

  try {
    const soporte = await Soporte.findById(id);
    if (!soporte) {
      return res.status(404).json({ msg: "Mensaje no encontrado" });
    }

    // Agregar la respuesta al array
    soporte.respuestas.push({
      mensaje,
      admin: "admin", // O puedes sacar el nombre del req.usuario si lo manejas así
    });

    soporte.solucionado = true;

    await soporte.save();

    // Obtener el email del usuario
    const Modelo = soporte.rol === "Cliente" ? Cliente : Productores;
    const usuario = await Modelo.findById(soporte.usuario);

    if (usuario?.email) {
      const nombre = usuario.nombre || "usuario";
      await sendMailRespuestaSoporte(usuario.email, nombre, mensaje);
    }

    res.json({ msg: "Respuesta enviada y correo notificado" });

  } catch (error) {
    console.error("Error al responder mensaje:", error);
    res.status(500).json({ msg: "Error al responder el mensaje" });
  }
};



export { enviarMensaje, obtenerMensajes, marcarComoLeido ,marcarComoSolucionado,responderMensaje};
