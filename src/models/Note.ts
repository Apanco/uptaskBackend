import moongose, { Schema, Document, Types } from "mongoose"

export interface I_Note extends Document {
    content:string,
    createdBy: Types.ObjectId,
    task: Types.ObjectId
}

const NoteSchema = new Schema({
    content:{
        type:String,
        required:true,
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    },
    task:{
        type:Types.ObjectId,
        ref:"Task",
        required:true
    }
}, {timestamps:true})


const Note = moongose.model<I_Note>('Note', NoteSchema)
export default Note;