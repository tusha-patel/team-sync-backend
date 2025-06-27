import { HTTPSTATUS, HttpStatusCodeType } from "../config/http.config";
import { ErrorCodeEnum, errorCodeEnumType } from "../enums/error-code.enum";


export class AppError extends Error {
    public statusCode: HttpStatusCodeType;
    public errorCode: errorCodeEnumType;
    constructor(
        message: string,
        statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
        errorCode?: errorCodeEnumType,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR;
        this.name = this.constructor.name; // Set the name of the error to the class name
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
}

export class HttpException extends AppError {
    constructor(
        message = "Http Exception Error",
        statusCode: HttpStatusCodeType,
        errorCode?: errorCodeEnumType
    ) {
        super(message, statusCode, errorCode);
    }
}



export class InternalServerException extends AppError {
    constructor(message = "internal Server Error ", errorCode?: errorCodeEnumType) {
        super(
            message,
            HTTPSTATUS.INTERNAL_SERVER_ERROR,
            errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR
        )
    }
}


export class NotFoundException extends AppError {
    constructor(message = "Resource Not Found", errorCode?: errorCodeEnumType) {
        super(
            message,
            HTTPSTATUS.NOT_FOUND,
            errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND
        )
    }
}

export class BadRequestException extends AppError {
    constructor(message = "Bad Request", errorCode?: errorCodeEnumType) {
        super(
            message,
            HTTPSTATUS.BAD_REQUEST,
            errorCode || ErrorCodeEnum.VALIDATION_ERROR
        )
    }
}


export class unAuthorizedException extends AppError {
    constructor(message = "unauthorized access", errorCode?: errorCodeEnumType) {
        super(
            message,
            HTTPSTATUS.UNAUTHORIZED,
            errorCode || ErrorCodeEnum.ACCESS_UNAUTHORIZED
        )
    }
}