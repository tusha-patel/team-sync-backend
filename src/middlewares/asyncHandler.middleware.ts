import { Request, Response, NextFunction } from 'express';


// asyncHandler is a middleware that wraps an async controller function
type AsyncHandlerControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

export const asyncHandler = (controller: AsyncHandlerControllerType): AsyncHandlerControllerType => async (req, res, next) => {
    try {
        await controller(req, res, next);
    } catch (error) {
        next(error);
    }
}