import moongose, { Schema, Document, Types } from "mongoose";


export interface I_Token extends Document{
    token:string,
    user:Types.ObjectId,
    createdAt:Date
}

const tokenSchema : Schema  = new Schema({
    token:{
        type:String,
        required:true
    },
    user:{
        type:Types.ObjectId,
        ref:'User'
    },
    expiresAt:{
        type:Date,
        default: Date.now(),
        expires:"15m"
    }
})

const Token = moongose.model<I_Token>('Token', tokenSchema)
export default Token