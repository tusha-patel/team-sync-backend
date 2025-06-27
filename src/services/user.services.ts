import UserModel from "../models/user.model"
import { BadRequestException } from "../utils/appError";

// get current user service
export const getCurrentUserServices = async (userId: string) => {
    try {
        const user = await UserModel.findById(userId).populate("currentWorkspace").select("-password");
        if (!user) {
            throw new BadRequestException("User not found");
        }

        return { user }
    } catch (error) {
        console.log("Error form user fetch services", error);
    }
}