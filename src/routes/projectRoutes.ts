import { Router } from "express"
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputsErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExist } from "../middleware/project";
import { taskAuthorization, taskBelongToProject, validateTaskExist } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();


router.use(authenticate)

//*     ->  Endponits

//. ->  Obtener todos los proyectos
router.get("/",ProjectController.getAllProjects)

//. ->  Get a count of projects
router.get("/count",ProjectController.countUserProjectsManager)
//. ->  Get a project by id
router.get("/:id",
    param("id").isMongoId().withMessage("Id no valido"),
    handleInputsErrors,
    ProjectController.getProjectById
)
//. Crear proyecto
router.post("/",
    body('projectName')
    .notEmpty().withMessage("El nombre del proyecto es obligatorio"),
    body('clientName')
    .notEmpty().withMessage("El nombre del cliente es obligatorio"),
    body('description')
    .notEmpty().withMessage("La descripcion del proyecto es obligatoria es obligatorio"),
    handleInputsErrors
    ,ProjectController.createProject
)

router.param('projectId', validateProjectExist) //# Cada que exista ese parametro se ejecutara el middlware ingresado

router.put("/:projectId",
    param("projectId").isMongoId().withMessage("Id no valido"),
    body('projectName')
    .notEmpty().withMessage("El nombre del proyecto es obligatorio"),
    body('clientName')
    .notEmpty().withMessage("El nombre del cliente es obligatorio"),
    body('description')
    .notEmpty().withMessage("La descripcion del proyecto es obligatoria es obligatorio"),
    handleInputsErrors,
    taskAuthorization,
    ProjectController.updateProject
)

router.delete("/:projectId",
    param("projectId").isMongoId().withMessage("Id no valido"),
    handleInputsErrors,
    taskAuthorization,
    ProjectController.deleteProject
)


//$ Parametros 

router.param("taskId", validateTaskExist)
router.param("taskId", taskBelongToProject)

//?     ->  Rutas para las tareas
router.post("/:projectId/tasks",//* C --> Crear tarea 
    taskAuthorization,
    body('name')
    .notEmpty().withMessage("El nombre de la tarea es obligatorio"),
    body('description')
    .notEmpty().withMessage("La descripcion es obligatorio"),
    handleInputsErrors,
    TaskController.createTask
)

router.get("/:projectId/tasks",//* R --> Obtener tareas por projectId

    TaskController.getProjectTask
)

router.get("/:projectId/tasks/:taskId",//* R --> Obtener tareas su id
    param("taskId").isMongoId().withMessage("El id de tarea no es valido"),
    handleInputsErrors,
    TaskController.getTaskById
)
router.put("/:projectId/tasks/:taskId",//* U --> Actualizar tareas
    taskAuthorization,
    param("taskId").isMongoId().withMessage("El id de tarea no es valido"),

    body('name')
    .notEmpty().withMessage("El nombre de la tarea es obligatorio"),
    body('description')
    .notEmpty().withMessage("La descripcion es obligatorio"),

    handleInputsErrors,
    
    TaskController.updateTask
)

router.delete("/:projectId/tasks/:taskId",//* D --> Eliminar tareas su id
    taskAuthorization,
    param("taskId").isMongoId().withMessage("El id de tarea no es valido"),
    handleInputsErrors,
    TaskController.deleteTask
)


router.post("/:projectId/tasks/:taskId/status", //* U --> Actualizar el estado de la tarea
    param("taskId").isMongoId().withMessage("El id de tarea no es valido"),
    body('status')
        .notEmpty().withMessage("El estado es obligatorio"),    
    handleInputsErrors,
    TaskController.updateStatus
)
//$ ->  Routes for teams 

router.post("/:projectId/team/find",
    body("email")
        .isEmail().toLowerCase().withMessage("Email no validó"),
    handleInputsErrors,
    TeamController.findByEmail
)
router.post("/:projectId/team",
    body("id")
        .isMongoId().withMessage("Id no valido"),
    handleInputsErrors,
    TeamController.addMemberById
)
router.delete("/:projectId/team/:userId",
    param("userId")
        .isMongoId().withMessage("Id no valido"),
    handleInputsErrors,
    TeamController.removeMemberById
)
router.get("/:projectId/team",
    TeamController.getProjectTeam
)



//# ->  Routes for notes

//. ->  Create a note
router.post("/:projectId/task/:taskId/notes",
    body("content").notEmpty().withMessage("El contenido de la nota es obligatorio"),
    handleInputsErrors,
    NoteController.createNote
)
//. ->  Get all note´s for a task
router.get("/:projectId/task/:taskId/notes",
    NoteController.getTaskNotes
)

//. ->  delete a note by id
router.delete("/:projectId/task/:taskId/notes/:noteId",
    param('noteId').isMongoId().withMessage("Id no valido"),
    handleInputsErrors,
    NoteController.deleteNote
)


// #     ->  Exportacion del router

export default router