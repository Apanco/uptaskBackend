import type { Request, Response, NextFunction} from "express"; 
import Task, { I_Task } from "../models/Task";

declare global{
    namespace Express {
        interface Request {
            task:I_Task 
        }
    }
}

export async function validateTaskExist(request:Request, response:Response, next:NextFunction) {
    try{
        //*Obtener el id del proyecto y encontrar el proyecto
        const { taskId } = request.params
        const task = await Task.findById(taskId);
        if(!task){
            const error = new Error("Tarea no encontrado")
            return response.status(404).json({error:error.message})
        }
        request.task = task
        next()
    }catch(error){
        response.status(500).json({error:"Hubo un error al procesar la solicitud"})
    }
}

export function taskBelongToProject(request:Request, response:Response, next:NextFunction){
    try {
        const task = request.task
        if(task.project.toString() !== request.project.id.toString()){
            const error = new Error("Accion no valida")
            return response.status(400).json({error:error.message})
        }else{
            next()
        }
    } catch (error) {
        response.status(500).json({error:"Hubo un error al procesar la solicitud"})
    }
}   
export function taskAuthorization(request:Request, response:Response, next:NextFunction){
    try {
        //. ->  Verificar si el usuario es el manager del projecto
        if(request.user.id.toString() !== request.project.manager.toString()){
            const error = new Error("Accion no valida")
            return response.status(400).json({error:error.message})
        }else{
            next()
        }
    } catch (error) {
        response.status(500).json({error:"Hubo un error al procesar la solicitud"})
    }
}   