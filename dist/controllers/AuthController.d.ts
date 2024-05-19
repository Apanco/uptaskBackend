import { Request, Response } from "express";
export declare class AuthController {
    static createAccount: (request: Request, response: Response) => Promise<Response<any, Record<string, any>>>;
    static confirAccount: (request: Request, response: Response) => Promise<Response<any, Record<string, any>>>;
    static login: (request: Request, response: Response) => Promise<Response<any, Record<string, any>>>;
    static requestConfirmationCode: (request: Request, response: Response) => Promise<Response<any, Record<string, any>>>;
    static forgotPassword: (request: Request, response: Response) => Promise<Response<any, Record<string, any>>>;
    static validateToken: (request: Request, response: Response) => Promise<Response<any, Record<string, any>>>;
    static updatePasswordWithToken: (request: Request, response: Response) => Promise<Response<any, Record<string, any>>>;
    static user: (request: Request, response: Response) => Promise<Response<any, Record<string, any>>>;
    static updateProfile: (request: Request, response: Response) => Promise<Response<any, Record<string, any>>>;
    static updatePassword: (request: Request, response: Response) => Promise<Response<any, Record<string, any>>>;
    static checkPassword: (request: Request, response: Response) => Promise<Response<any, Record<string, any>>>;
}
