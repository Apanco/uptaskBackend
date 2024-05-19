import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()

const config = ()=>{
    return {
        host: process.env.SMPT_HOST,
        port: +process.env.SMPT_PORT,
        auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASSWORD
        }
    }
}


export const transporter = nodemailer.createTransport(config())