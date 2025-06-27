import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getCurrentUserServices } from "../services/user.services";


// get current user
export const getCurrentUserController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    
    const result = await getCurrentUserServices(userId);
    const user = result?.user;

    return res.status(HTTPSTATUS.OK).json({
        message: "User fetch successfully",
        user
    })
})