import { type Request, type Response } from "express";
export declare class TaskController {
    static createTask: (request: Request, response: Response) => Promise<void>;
    static getProjectTask: (request: Request, response: Response) => Promise<void>;
    static getTaskById: (request: Request, response: Response) => Promise<void>;
    static updateTask: (request: Request, response: Response) => Promise<void>;
    static deleteTask: (request: Request, response: Response) => Promise<void>;
    static updateStatus: (request: Request, response: Response) => Promise<void>;
}
