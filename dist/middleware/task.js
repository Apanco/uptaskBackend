"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskAuthorization = exports.taskBelongToProject = exports.validateTaskExist = void 0;
const Task_1 = __importDefault(require("../models/Task"));
async function validateTaskExist(request, response, next) {
    try {
        //*Obtener el id del proyecto y encontrar el proyecto
        const { taskId } = request.params;
        const task = await Task_1.default.findById(taskId);
        if (!task) {
            const error = new Error("Tarea no encontrado");
            return response.status(404).json({ error: error.message });
        }
        request.task = task;
        next();
    }
    catch (error) {
        response.status(500).json({ error: "Hubo un error al procesar la solicitud" });
    }
}
exports.validateTaskExist = validateTaskExist;
function taskBelongToProject(request, response, next) {
    try {
        const task = request.task;
        if (task.project.toString() !== request.project.id.toString()) {
            const error = new Error("Accion no valida");
            return response.status(400).json({ error: error.message });
        }
        else {
            next();
        }
    }
    catch (error) {
        response.status(500).json({ error: "Hubo un error al procesar la solicitud" });
    }
}
exports.taskBelongToProject = taskBelongToProject;
function taskAuthorization(request, response, next) {
    try {
        //. ->  Verificar si el usuario es el manager del projecto
        if (request.user.id.toString() !== request.project.manager.toString()) {
            const error = new Error("Accion no valida");
            return response.status(400).json({ error: error.message });
        }
        else {
            next();
        }
    }
    catch (error) {
        response.status(500).json({ error: "Hubo un error al procesar la solicitud" });
    }
}
exports.taskAuthorization = taskAuthorization;
//# sourceMappingURL=task.js.map