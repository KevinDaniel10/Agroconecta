import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Configuración del transporter
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.PASS_GMAIL,
    },
    tls: {
        rejectUnauthorized: false // ⚠️ Solo usar en desarrollo
    }
})

// Enviar correo para confirmar cuenta
const sendMailToUser = (userMail, token) => {
    const mailOptions = {
        from: process.env.USER_GMAIL,
        to: userMail,
        subject: "Verifica tu cuenta",
        html: `
            <p>Hola, haz clic <a href="${process.env.URL_FRONTEND}confirmar/${encodeURIComponent(token)}">aquí</a> para confirmar tu cuenta.</p>
        `
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error al enviar correo:", error)
        } else {
            console.log("Correo enviado:", info.response)
        }
    })
}

// Enviar correo para recuperar contraseña
const sendMailToRecoveryPassword = async (userMail, token, rol) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.USER_GMAIL,
            to: userMail,
            subject: "Recupera tu contraseña",
            html: `
                <h1>Agro Conecta</h1>
                <hr>
                <p>
                    <a href="${process.env.URL_FRONTEND}${rol}/recuperar-password/${token}">
                        Haz clic aquí para restablecer tu contraseña
                    </a>
                </p>
            `
        });
        console.log("Correo de recuperación enviado:", info.messageId);
    } catch (error) {
        console.error("Error al enviar correo de recuperación:", error);
    }
};


export {
    sendMailToUser,
    sendMailToRecoveryPassword
}
