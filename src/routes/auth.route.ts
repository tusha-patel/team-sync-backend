import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import { googleLoginCallback, loginController, logOutController, registerUserController } from "../controllers/auth.controller";

const authRoutes = Router();
const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;


// google with authentication
authRoutes.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false, //1
        prompt: 'select_account',
    })
);

authRoutes.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: failedUrl,
        // session: true,
        session: false,//1
    }),
    googleLoginCallback
);


authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginController);
authRoutes.post("/logout", logOutController);
export default authRoutes;