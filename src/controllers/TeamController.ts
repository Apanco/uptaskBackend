import { type Request, type Response} from "express";
import User from "../models/User";
import Project from "../models/Project";


export class TeamController {

    //# ->  Buscar miembro por su email
    static findByEmail = async (request: Request, response : Response) =>{
        const { email } = request.body
        //. ->  Obtener usuario
        const user = await User.findOne({email}).select("id email name")
        //. ->  Verificar que exista
        if(!user){
            const error = new Error("Usuario no encontrado")
            return response.status(404).json({error:error.message})
        }
        response.json(user)
    }
    //# ->  Agregar miembro por id
    static addMemberById = async (request: Request, response : Response) =>{
        //. Obtener id
        const { id } = request.body
        //. ->  Obtener usuario
        const user = await User.findById(id).select("id")
        //. ->  Verificar que exista el usuario
        if(!user){
            const error = new Error("Usuario no encontrado")
            return response.status(404).json({error:error.message})
        }

        //. ->  Verificar si no ha sido agregado previamente
        if(request.project.team.some(team => team.toString() === user.id.toString())){
            const error = new Error("El usuario ya existe en el proyecto")
            return response.status(409).json({error:error.message})
        }

        //. ->  Agregarlo al arreglo de miembros del proyecto
        request.project.team.push(user.id)
        await request.project.save()
        response.send("Usuario agregado correctamente")
    }
    //# ->  Eliminar a miembro por id
    static removeMemberById = async (request: Request, response : Response) =>{
        //. Obtener id
        const { userId } = request.params
         //. ->  Verificar existe en el equipo
         if(!request.project.team.some(team => team.toString() === userId)){
            const error = new Error("El usuario no existe en el proyecto")
            return response.status(409).json({error:error.message})
        }

        //. ->  Retirar proyecto
        request.project.team = request.project.team.filter(teamMember => teamMember.toString() !== userId)
        await request.project.save()
        //. ->  Respuesta
        response.send("Usuario eliminado correctamente")
    }
    static getProjectTeam =  async (request: Request, response : Response) =>{
        //. ->  Obtener proyecto
        const project = await Project.findById(request.project.id).populate({
            path:"team",
            select:"id email name"
        })
        response.json(project.team)
    }
}