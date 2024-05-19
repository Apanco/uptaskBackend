import type { Request, Response, NextFunction } from "express";
export declare const handleInputsErrors: (request: Request, response: Response, next: NextFunction) => Response<any, Record<string, any>>;
