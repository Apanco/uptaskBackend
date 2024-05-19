import { token } from "morgan";
import { transporter } from "../config/nodemailer";

interface I_Email{
    email:string
    name:string
    token:string
}

export class AuthEmail{
    static senConfirmationEmail = async (user : I_Email)=>{
        //# ->  Enviar email
       const info = await transporter.sendMail({
            from:"UpTask <admin@uptask.com>",
            to:user.email,
            subject: "UpTask - Confirma tu cuenta",
            text: "UpTask - Confirma tu cuenta",
            html:`<p>Hola ${user.name}, has creado tu cuenta en UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
            <p>Visita el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
            <p>E ingresa el codigo: <b>${user.token}<b/></p>
            <p>Este token expira en 10 min</p>
            `

        })

    }
    static sendPasswordResetToken = async (user : I_Email)=>{
        //# ->  Enviar email
       const info = await transporter.sendMail({
            from:"UpTask <admin@uptask.com>",
            to:user.email,
            subject: "UpTask - Restablece tu contraseña",
            text: "UpTask - Restablece tu contraseña",
            html:`<p>Hola ${user.name}, has solicitado restablecer tu password</p>
            <p>Visita el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer tu contraseña</a>
            <p>E ingresa el codigo: <b>${user.token}<b/></p>
            <p>Este token expira en 10 min</p>
            `

        })

    }
}