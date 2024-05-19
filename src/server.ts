import express from "express";
import dotenv from "dotenv"
import { conectDB } from "./config/db";
import projecRoutes  from "./routes/projectRoutes";
import authRoutes from "./routes/authRoutes";
import cors from "cors"
import { corsConfig } from "./config/cors";
import morgan from "morgan";

dotenv.config();

conectDB();
//Inicio de aplicacion
const app = express();
//Cors
app.use(cors(corsConfig))
//Morgan
//login
app.use(morgan("dev"))
//Habilitar lectura de datos
app.use(express.json())

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projecRoutes)

export default app  