import { type Request, type Response } from "express";
import Task, { I_Task } from "../models/Task";
import { populate } from "dotenv";



export class TaskController{

    static createTask = async (request: Request, response: Response) => {//* Create
        try {
            const {project} = request
            //Recuperacion del body
            const task : I_Task = new Task(request.body)
            //Asignacion del proyecto
            task.project = project.id
            //Asignacion de la tarea al proyecto
            project.tasks.push(task.id)
            //Arreglos de promesas, se ejecutaran ambas tareas al mismo tiempo y se esperara por ambas
            await Promise.allSettled([
                //Guardar tarea creada en base de datos
                task.save(),
                //Actualizar o insertar tarea al proyecto
                project.save()
            ])
            response.status(201).send("Tarea creada correctamente");
        } catch (error) {
            response.status(500).json({error:"Hubo un error al procesar la solicitud"})
        }
    }
    static getProjectTask = async (request: Request, response: Response) => {

        try {
            const tasks = await Task.find({project: request.project.id}).populate('project')
            response.status(200).json(tasks)
        } catch (error) {
            response.status(500).json({error:"Hubo un error al procesar la solicitud"})
        }
    }
    static getTaskById = async (request: Request, response: Response) => {//* Read
        try {
            const task = await Task.findById(request.task.id)
                .populate({
                    path:"completedBy.user",
                    select:"id name email"
                })
                .populate({
                    path:"notes", 
                    populate:{
                        path:"createdBy", 
                        select:"id, name email"
                    },
                    options:{
                        sort:{createdAt:-1}
                    }
                })
            response.json(task)
        } catch (error) {
            response.status(500).json({error:"Hubo un error al procesar la solicitud"})
        }
    }
    static updateTask = async (request: Request, response: Response) => {//* Update
        try {
            const task = request.task
            //Si ambos se cumplen se actualiza la actualizacion
            task.name = request.body.name
            task.description = request.body.description
            await task.save()
            response.status(201).send("Tarea actualizada")
        } catch (error) {
            response.status(500).json({error:"Hubo un error al procesar la solicitud xd"})
        }
    }
    static deleteTask = async (request : Request, response: Response ) => {//* Delete
        try {
            const task = request.task
    
            //Si ambos se cumplen se elimina la tarea
            let project = request.project

            project.tasks = project.tasks.filter( taskId => taskId.toString() !== task.id.toString())
            
            await Promise.allSettled([
                task.deleteOne(),
                project.save()
            ])
            response.status(200).send("Tarea eliminada")
        } catch (error) {
            response.status(500).json({error:"Hubo un error al procesar la solicitud xd"})
        }
    }
    static updateStatus = async (request: Request, response: Response) => {
        try {
            const {status} = request.body
            const task = request.task
            task.status = status

            const data = {
                user:request.user.id,
                status
            }
            task.completedBy.push(data);

            await task.save();
            response.status(201).send("Tarea actualizada")

        } catch (error) {
            response.status(500).json({error:"Hubo un error al procesar la solicitud xd"})
        }
    }
}