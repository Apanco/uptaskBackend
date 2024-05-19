import { type Request, type Response } from "express";
import Note, {I_Note} from "../models/Note";
import { Types } from "mongoose";
type NoteParams = {
    noteId: Types.ObjectId
}

export class NoteController{

    //# ->  Create notes
    static createNote = async(request: Request<{},{},I_Note,{}>, response: Response) => {
        //. ->  Declarar variables
        const { content } = request.body;//* Contenido de nota
        const { task } = request//*Tarea asociada a la nota
        //. ->  Crear instancia de nota
        const note = new Note;
        //. ->  Asignar sus atributos
        note.content = content
        note.createdBy= request.user.id
        note.task=task.id
        //. ->  Almacenar en la tarea
        task.notes.push(note.id)
        //. ->  Almacenar y guardar cambios
        try {
            await Promise.allSettled([
                note.save(),
                task.save()
            ])
            response.send("Nota creada correctamente");
        } catch (error) {
            response.status(500).json({error:"Hubo un error"})
        }
    }
    static getTaskNotes =  async(request: Request, response: Response) =>{
        try {
            const notes = await Note.find({task:request.task.id}).populate({
                path:"createdBy",
                select:"id email name"
            }).sort({createdAt:-1})
            response.json(notes)            
        } catch (error) {
            response.status(500).json({error:"Hubo un error"})
        }
    }
    static deleteNote =  async(request: Request<NoteParams>, response: Response) =>{
        const { noteId } = request.params;
        const note = await Note.findById(noteId);
        const task = request.task
        if(!note){
            const error = new Error("Nota no encontrada")
            return response.status(404).json({error:error.message})
        }
        if(note.createdBy.toString() !== request.user.id.toString()){
            const error = new Error("Accion no valida")
            return response.status(401).json({error:error.message})
        }
        task.notes = task.notes.filter(note => note.toString()!==noteId.toString())
        try {
            await Promise.allSettled([
                task.save(),
                note.deleteOne()
            ])
            response.send("Nota eliminada")
        } catch (error) {
            response.status(500).json({error:"Hubo un error"})
        }
    }
}