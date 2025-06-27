// storage for error codes used in the application
export const ErrorCodeEnum = {
    // auth errors  
    AUTH_EMAIL_ALREADY_EXISTS: "AUTH_EMAIL_ALREADY_EXISTS",
    AUTH_INVALID_TOKEN: "AUTH_INVALID_TOKEN",
    AUTH_USER_NOT_FOUND: "AUTH_USER_NOT_FOUND",

    AUTH_NOT_FOUND: "AUTH_NOT_FOUND",
    AUTH_TOO_MANY_ATTEMPTS: "AUTH_TOO_MANY_ATTEMPTS",
    AUTH_UNAUTHORIZED_ACCESS: "AUTH_UNAUTHORIZED_ACCESS",
    AUTH_TOKEN_NOT_FOUND: "AUTH_TOKEN_NOT_FOUND",

    // access errors
    ACCESS_UNAUTHORIZED: "ACCESS_UNAUTHORIZED",

    // validation errors
    VALIDATION_ERROR: "VALIDATION_ERROR",
    RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",

    // server errors
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",

} as const;


export type errorCodeEnumType = keyof typeof ErrorCodeEnum;
