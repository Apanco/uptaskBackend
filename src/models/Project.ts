import mongoose, {Schema, Document, PopulatedDoc, Types} from "mongoose";
import Task, { I_Task } from "./Task";
import User, { I_User } from "./User";
import Note from "./Note";

//! ->Type para typescript
export type ProjectType = Document & {
    projectName: string,
    clientName:string,
    description:string,
    tasks: PopulatedDoc<I_Task & Document>[]
    manager:PopulatedDoc<I_User & Document>
    team:PopulatedDoc<I_User & Document>[]
}
//? -> schema para mongoose
const ProjectSchema : Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks:[
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    
    manager:{
        type: Types.ObjectId,
        ref: 'User'
    },
    team:[
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ]
}, {timestamps: true}) 

//# ->  Middleware
ProjectSchema.pre('deleteOne',{
    document:true,
    query:false
},async function(){
    //. ->  Obtener projecto que se eliminara
    const projectId = this._id;
    if(!projectId) return
    //. ->  Obtener todas las tareas asociadas
    const tasks = await Task.find({project:projectId})
    //. ->  Iteramos sobre las tareas
    for(const task of tasks){
        await Note.deleteMany({task:task.id})
    }


    await Task.deleteMany({project:projectId})
})

const Project = mongoose.model<ProjectType>('Project', ProjectSchema)

export default Project //Para usar en los controladores