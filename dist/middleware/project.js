"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProjectExist = void 0;
const Project_1 = __importDefault(require("../models/Project"));
async function validateProjectExist(request, response, next) {
    try {
        //*Obtener el id del proyecto y encontrar el proyecto
        const { projectId } = request.params;
        const project = await Project_1.default.findById(projectId);
        if (!project) {
            const error = new Error("Proyecto no encontrado");
            return response.status(404).json({ error: error.message });
        }
        request.project = project;
        next();
    }
    catch (error) {
        response.status(500).json({ error: "Hubo un error al procesar la solicitud" });
    }
}
exports.validateProjectExist = validateProjectExist;
//# sourceMappingURL=project.js.map