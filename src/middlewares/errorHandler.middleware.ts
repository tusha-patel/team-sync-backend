import { ErrorRequestHandler, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../utils/appError";
import { z, ZodError } from "zod";
import { ErrorCodeEnum } from "../enums/error-code.enum";

// for zod error handling function
const formatZodError = (res: Response, error: z.ZodError) => {
    const errors = error?.issues.map(err => ({
        field: err.path.join("."),
        message: err.message
    }));

    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Validation failed",
        errors: errors,
        errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    })
}

// this is error handling for all routes
export const errorHandler: ErrorRequestHandler = (error, req, res, next): any => {
    console.log(`Error Occurred on PATH: ${req.path}`, error);

    if (error instanceof SyntaxError) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "invalid JSON format ,please check your request body",
        });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.errorCode,
        })
    }

    if (error instanceof ZodError) {
        return formatZodError(res, error);
    }

    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
        error: error?.message || "An unexpected error occurred",
    });
}