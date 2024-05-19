"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProjectController_1 = require("../controllers/ProjectController");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const TaskController_1 = require("../controllers/TaskController");
const project_1 = require("../middleware/project");
const task_1 = require("../middleware/task");
const auth_1 = require("../middleware/auth");
const TeamController_1 = require("../controllers/TeamController");
const NoteController_1 = require("../controllers/NoteController");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
//*     ->  Endponits
//. ->  Obtener todos los proyectos
router.get("/", ProjectController_1.ProjectController.getAllProjects);
//. ->  Get a count of projects
router.get("/count", ProjectController_1.ProjectController.countUserProjectsManager);
//. ->  Get a project by id
router.get("/:id", (0, express_validator_1.param)("id").isMongoId().withMessage("Id no valido"), validation_1.handleInputsErrors, ProjectController_1.ProjectController.getProjectById);
//. Crear proyecto
router.post("/", (0, express_validator_1.body)('projectName')
    .notEmpty().withMessage("El nombre del proyecto es obligatorio"), (0, express_validator_1.body)('clientName')
    .notEmpty().withMessage("El nombre del cliente es obligatorio"), (0, express_validator_1.body)('description')
    .notEmpty().withMessage("La descripcion del proyecto es obligatoria es obligatorio"), validation_1.handleInputsErrors, ProjectController_1.ProjectController.createProject);
router.param('projectId', project_1.validateProjectExist); //# Cada que exista ese parametro se ejecutara el middlware ingresado
router.put("/:projectId", (0, express_validator_1.param)("projectId").isMongoId().withMessage("Id no valido"), (0, express_validator_1.body)('projectName')
    .notEmpty().withMessage("El nombre del proyecto es obligatorio"), (0, express_validator_1.body)('clientName')
    .notEmpty().withMessage("El nombre del cliente es obligatorio"), (0, express_validator_1.body)('description')
    .notEmpty().withMessage("La descripcion del proyecto es obligatoria es obligatorio"), validation_1.handleInputsErrors, task_1.taskAuthorization, ProjectController_1.ProjectController.updateProject);
router.delete("/:projectId", (0, express_validator_1.param)("projectId").isMongoId().withMessage("Id no valido"), validation_1.handleInputsErrors, task_1.taskAuthorization, ProjectController_1.ProjectController.deleteProject);
//$ Parametros 
router.param("taskId", task_1.validateTaskExist);
router.param("taskId", task_1.taskBelongToProject);
//?     ->  Rutas para las tareas
router.post("/:projectId/tasks", //* C --> Crear tarea 
task_1.taskAuthorization, (0, express_validator_1.body)('name')
    .notEmpty().withMessage("El nombre de la tarea es obligatorio"), (0, express_validator_1.body)('description')
    .notEmpty().withMessage("La descripcion es obligatorio"), validation_1.handleInputsErrors, TaskController_1.TaskController.createTask);
router.get("/:projectId/tasks", //* R --> Obtener tareas por projectId
TaskController_1.TaskController.getProjectTask);
router.get("/:projectId/tasks/:taskId", //* R --> Obtener tareas su id
(0, express_validator_1.param)("taskId").isMongoId().withMessage("El id de tarea no es valido"), validation_1.handleInputsErrors, TaskController_1.TaskController.getTaskById);
router.put("/:projectId/tasks/:taskId", //* U --> Actualizar tareas
task_1.taskAuthorization, (0, express_validator_1.param)("taskId").isMongoId().withMessage("El id de tarea no es valido"), (0, express_validator_1.body)('name')
    .notEmpty().withMessage("El nombre de la tarea es obligatorio"), (0, express_validator_1.body)('description')
    .notEmpty().withMessage("La descripcion es obligatorio"), validation_1.handleInputsErrors, TaskController_1.TaskController.updateTask);
router.delete("/:projectId/tasks/:taskId", //* D --> Eliminar tareas su id
task_1.taskAuthorization, (0, express_validator_1.param)("taskId").isMongoId().withMessage("El id de tarea no es valido"), validation_1.handleInputsErrors, TaskController_1.TaskController.deleteTask);
router.post("/:projectId/tasks/:taskId/status", //* U --> Actualizar el estado de la tarea
(0, express_validator_1.param)("taskId").isMongoId().withMessage("El id de tarea no es valido"), (0, express_validator_1.body)('status')
    .notEmpty().withMessage("El estado es obligatorio"), validation_1.handleInputsErrors, TaskController_1.TaskController.updateStatus);
//$ ->  Routes for teams 
router.post("/:projectId/team/find", (0, express_validator_1.body)("email")
    .isEmail().toLowerCase().withMessage("Email no validó"), validation_1.handleInputsErrors, TeamController_1.TeamController.findByEmail);
router.post("/:projectId/team", (0, express_validator_1.body)("id")
    .isMongoId().withMessage("Id no valido"), validation_1.handleInputsErrors, TeamController_1.TeamController.addMemberById);
router.delete("/:projectId/team/:userId", (0, express_validator_1.param)("userId")
    .isMongoId().withMessage("Id no valido"), validation_1.handleInputsErrors, TeamController_1.TeamController.removeMemberById);
router.get("/:projectId/team", TeamController_1.TeamController.getProjectTeam);
//# ->  Routes for notes
//. ->  Create a note
router.post("/:projectId/task/:taskId/notes", (0, express_validator_1.body)("content").notEmpty().withMessage("El contenido de la nota es obligatorio"), validation_1.handleInputsErrors, NoteController_1.NoteController.createNote);
//. ->  Get all note´s for a task
router.get("/:projectId/task/:taskId/notes", NoteController_1.NoteController.getTaskNotes);
//. ->  delete a note by id
router.delete("/:projectId/task/:taskId/notes/:noteId", (0, express_validator_1.param)('noteId').isMongoId().withMessage("Id no valido"), validation_1.handleInputsErrors, NoteController_1.NoteController.deleteNote);
// #     ->  Exportacion del router
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map