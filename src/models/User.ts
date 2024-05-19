import moongose, { Schema, Document } from "mongoose";


export interface I_User extends Document{
    email:string,
    password:string,
    name:string
    confirmed:boolean
}

const UserSchema: Schema = new Schema({
    email:{
        type:String,
        require:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    name:{
        type:String,
        require:true,
    },
    confirmed:{
        type:Boolean,
        default:false
    }
})
const User = moongose.model<I_User>('User', UserSchema)
export default User