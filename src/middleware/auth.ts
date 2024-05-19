import type { Request, Response, NextFunction} from "express"; 
import jwt from "jsonwebtoken";
import User, { I_User } from "../models/User";
import { ExpressValidator } from "express-validator";

declare global{
    namespace Express{
        interface Request{
            user?: I_User
        }
    }
}


export const authenticate = async (request:Request, response:Response, next:NextFunction) => {
    const bearer = request.headers.authorization
    if(!bearer){
        const error = new Error('No autorizado');
        return response.status(401).json({error:error.message})
    }
    const token = bearer.split(' ')[1]
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(typeof decoded === "object" && decoded.id ){
            const user = await User.findById(decoded.id).select('_id name email')
            if(user){
                request.user=user
                next()
            }else{
                response.status(500).json({error:"Token no valido"})
            }
        }
    } catch (error) {
        response.status(500).json({error:"Token no valido"})
    }
    
}