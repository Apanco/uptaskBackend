import type { Request, Response, NextFunction } from "express";
import { ProjectType } from "../models/Project";
declare global {
    namespace Express {
        interface Request {
            project: ProjectType;
        }
    }
}
export declare function validateProjectExist(request: Request, response: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
