import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator"

export const handleInputsErrors = ( request : Request, response : Response, next : NextFunction) =>  {
    let errors = validationResult(request);//Obtiene los errores
    if(!errors.isEmpty()){//Verifica si no esta vacio
        return response.status(400).json({errors:errors.array()})//Retorna un estado 400 y los errores en json
    }
    next()//Permite pasar al siguiente middleware
}