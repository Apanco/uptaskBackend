import { request, type Request, type Response} from "express";
import Project from "../models/Project";
import color from "colors";

export class ProjectController {



    //?---------->  Metodos
    //# ->  Crear proyecto
    static createProject = async (request: Request, response : Response) => { //* Create
        const project = new Project(request.body)//Crear la instancia
        //. ->  Asigna un manager
        project.manager = request.user.id
        try {
            await project.save();
            response.status(201).send("Proyecto creado correctamente")
         } catch (error) {
            console.log(color.red(error))
        }
    }

    //# ->  Obtener proyecto por id
    static getProjectById = async (request : Request, response: Response ) => {
        const {id} = request.params
        try {
            const project = await Project.findById(id).populate({
                path:"tasks",
                options:{sort:{updatedAt:1}}
            });
            if(!project){
                const error = new Error("Proyecto no encontrado")
                return response.status(404).json({error:error.message})
            }
            //. -> Verificar si quien solicita ver el proyecto es em manager
            if(project.manager.toString() !== request.user.id.toString() && !project.team.includes(request.user.id)){
                const error = new Error("Accion no valida")
                return response.status(404).json({error:error.message})
            }
            //. -> Si paso todas las verificaciones retorna el proyecto

            response.json(project);
        } catch (error) {
            // console.log(color.red(error))
        }
    }
    
    //# ->  Obtener todos los proyectos
    static getAllProjects = async (request : Request, response: Response ) => {//* Read
        try {
            const projects = await Project.find({
                //. -> Condiciones
                $or:[
                    {manager:{$in: request.user.id}},
                    {team:{$in:request.user.id}}
                ]
            }).populate("tasks");
            response.json(projects);
        } catch (error) {
            console.log(color.red(error))
        }
    }
    //# -> Obtener cantidad de proyectos
    static countUserProjectsManager = async(request: Request, response:Response)=>{
        try{
            const countManager = await Project.countDocuments({
               $or:[
                {manager:{$in:request.user.id}}
               ] 
            })
            const countMember = await Project.countDocuments({
                $or:[
                 {team:{$in:request.user.id}}
                ] 
             })
             response.json({
                manager:countManager,   
                member:countMember
             })
        }catch(error){
            response.status(500).json({ error: "Hubo un error" });
        }
    }
    //# ->  Actualizar proyecto
    static updateProject = async (request : Request, response: Response ) => {//* Update
        try { 
            const project = request.project
            //. -> Si paso todas las verificaciones retorna el proyecto
            project.clientName = request.body.clientName
            project.projectName = request.body.projectName
            project.description = request.body.description
            await project.save()
            response.status(200).send("Proyecto actualizado")
        } catch (error) {
            console.log(color.red(error))
        }
    }
    static deleteProject = async (request : Request, response: Response ) => {//* Delete
        try {
            const project = request.project
    
            //. -> Si paso todas las verificaciones ejecuta la accion
            await project.deleteOne()
            response.status(204).send("Proyecto eliminado")
        } catch (error) {
            console.log(color.red(error))
        }
    }
}