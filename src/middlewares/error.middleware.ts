import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error";

export const errorHandler = (error: Error | HttpError, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof HttpError) {
        res.status(error.errorCode).json({ message: error.message, error });
    } else {
        res.status(500).json({ message: error.message, error });
    }
};