import type { Request, Response, NextFunction } from "express";
import { I_Task } from "../models/Task";
declare global {
    namespace Express {
        interface Request {
            task: I_Task;
        }
    }
}
export declare function validateTaskExist(request: Request, response: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
export declare function taskBelongToProject(request: Request, response: Response, next: NextFunction): Response<any, Record<string, any>>;
export declare function taskAuthorization(request: Request, response: Response, next: NextFunction): Response<any, Record<string, any>>;
