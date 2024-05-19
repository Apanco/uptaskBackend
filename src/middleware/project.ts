import type { Request, Response, NextFunction} from "express"; 
import Project, { ProjectType } from "../models/Project";

declare global{
    namespace Express {
        interface Request {
            project: ProjectType    
        }
    }
}

export async function validateProjectExist(request:Request, response:Response, next:NextFunction) {
    try{
        //*Obtener el id del proyecto y encontrar el proyecto
        const { projectId } = request.params
        const project = await Project.findById(projectId);
        if(!project){
            const error = new Error("Proyecto no encontrado")
            return response.status(404).json({error:error.message})
        }
        request.project = project
        next()
    }catch(error){
        response.status(500).json({error:"Hubo un error al procesar la solicitud"})
    }
}
