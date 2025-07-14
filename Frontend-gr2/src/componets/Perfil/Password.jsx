import { useState, useContext } from "react"
import Mensaje from "../Alertas"
import AuthContext from "../../context/AuthProvider"

const Password = () => {
    const { actualizarPassword } = useContext(AuthContext)
    const [mensaje, setMensaje] = useState({})
    const [form, setForm] = useState({
        passwordactual:"",
        passwordnuevo:""
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (Object.values(form).includes(""))
        {
            setMensaje({ respuesta: "Todos los campos deben ser ingresados", tipo: false })
                setTimeout(() => {
                    setMensaje({})
                }, 3000);
            return
        }

 
        if (form.passwordnuevo.length < 6)
        {
            setMensaje({ respuesta: "El password debe tener mínimo 6 carácteres Hola", tipo: false })
                setTimeout(() => {
                    setMensaje({})
                }, 3000);
            return
        }

        const resultado = await actualizarPassword(form)
        console.log(resultado)
        setMensaje(resultado)
        setTimeout(() => {
            setMensaje({})
        }, 3000);
    }

    
}

export default Password