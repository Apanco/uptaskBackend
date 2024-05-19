"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteController = void 0;
const Note_1 = __importDefault(require("../models/Note"));
class NoteController {
    //# ->  Create notes
    static createNote = async (request, response) => {
        //. ->  Declarar variables
        const { content } = request.body; //* Contenido de nota
        const { task } = request; //*Tarea asociada a la nota
        //. ->  Crear instancia de nota
        const note = new Note_1.default;
        //. ->  Asignar sus atributos
        note.content = content;
        note.createdBy = request.user.id;
        note.task = task.id;
        //. ->  Almacenar en la tarea
        task.notes.push(note.id);
        //. ->  Almacenar y guardar cambios
        try {
            await Promise.allSettled([
                note.save(),
                task.save()
            ]);
            response.send("Nota creada correctamente");
        }
        catch (error) {
            response.status(500).json({ error: "Hubo un error" });
        }
    };
    static getTaskNotes = async (request, response) => {
        try {
            const notes = await Note_1.default.find({ task: request.task.id }).populate({
                path: "createdBy",
                select: "id email name"
            }).sort({ createdAt: -1 });
            response.json(notes);
        }
        catch (error) {
            response.status(500).json({ error: "Hubo un error" });
        }
    };
    static deleteNote = async (request, response) => {
        const { noteId } = request.params;
        const note = await Note_1.default.findById(noteId);
        const task = request.task;
        if (!note) {
            const error = new Error("Nota no encontrada");
            return response.status(404).json({ error: error.message });
        }
        if (note.createdBy.toString() !== request.user.id.toString()) {
            const error = new Error("Accion no valida");
            return response.status(401).json({ error: error.message });
        }
        task.notes = task.notes.filter(note => note.toString() !== noteId.toString());
        try {
            await Promise.allSettled([
                task.save(),
                note.deleteOne()
            ]);
            response.send("Nota eliminada");
        }
        catch (error) {
            response.status(500).json({ error: "Hubo un error" });
        }
    };
}
exports.NoteController = NoteController;
//# sourceMappingURL=NoteController.js.map