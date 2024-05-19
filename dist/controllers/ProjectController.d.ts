import { type Request, type Response } from "express";
export declare class ProjectController {
    static createProject: (request: Request, response: Response) => Promise<void>;
    static getProjectById: (request: Request, response: Response) => Promise<Response<any, Record<string, any>>>;
    static getAllProjects: (request: Request, response: Response) => Promise<void>;
    static countUserProjectsManager: (request: Request, response: Response) => Promise<void>;
    static updateProject: (request: Request, response: Response) => Promise<void>;
    static deleteProject: (request: Request, response: Response) => Promise<void>;
}
