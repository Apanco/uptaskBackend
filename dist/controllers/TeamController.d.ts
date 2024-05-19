import { type Request, type Response } from "express";
export declare class TeamController {
    static findByEmail: (request: Request, response: Response) => Promise<Response<any, Record<string, any>>>;
    static addMemberById: (request: Request, response: Response) => Promise<Response<any, Record<string, any>>>;
    static removeMemberById: (request: Request, response: Response) => Promise<Response<any, Record<string, any>>>;
    static getProjectTeam: (request: Request, response: Response) => Promise<void>;
}
