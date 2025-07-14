import Soporte from "../models/Soporte.js";

const enviarMensaje = async (req, res) => {
  const { mensaje } = req.body;

  if (!mensaje) {
    return res.status(400).json({ msg: "El mensaje no puede estar vacío" });
  }

  try {
    const nuevoMensaje = new Soporte({
      mensaje,
      usuario: req.usuario._id,
      rol: req.usuario.rol,
    });

    await nuevoMensaje.save();
    res.json({ msg: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al enviar el mensaje" });
  }
};

export { enviarMensaje };
