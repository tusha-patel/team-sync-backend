import { NextFunction, Request, Response } from "express";
import { unAuthorizedException } from "../utils/appError";


// check user authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user?._id) {
        throw new unAuthorizedException("unauthorized , please login");
    }
    next();
}


export default isAuthenticated;