import type { Request, Response, NextFunction } from "express";
import { I_User } from "../models/User";
declare global {
    namespace Express {
        interface Request {
            user?: I_User;
        }
    }
}
export declare const authenticate: (request: Request, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
