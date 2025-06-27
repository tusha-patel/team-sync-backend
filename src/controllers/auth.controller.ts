import { NextFunction, Request, Response } from "express";
import { config } from "../config/app.config";
import { registerSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import passport from "passport";
import { registerUserService } from "../services/auth.services";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { signJwtToken } from "../utils/jwt";

export const googleLoginCallback = asyncHandler(
    async (req: Request, res: Response) => {

        const jwt = req.jwt;

        const currentWorkspace = req.user?.currentWorkspace;
        // if (!currentWorkspace) {
        //     return res.redirect(
        //         `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
        //     );
        // }

        // return res.redirect(
        //     `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
        // );//1

        if (!jwt) {
            return res.redirect(
                `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
            );
        }

        return res.redirect(
              `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
            // `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=success&acceFss_token=${jwt}&current_workspace=${currentWorkspace}`
        )

    }
);

// register with email
export const registerUserController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = registerSchema.parse({
            ...req.body,
        });

        await registerUserService(body);

        return res.status(HTTPSTATUS.CREATED).json({
            message: "User created successfully",
        });
    }
);


// login with email using passport
export const loginController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            "local",
            (
                err: Error | null,
                user: Express.User | false,
                info: { message: string } | undefined
            ) => {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    return res.status(HTTPSTATUS.UNAUTHORIZED).json({
                        message: info?.message || "Invalid email or password",
                    });
                }
                // req.login(user, (err) => {
                //     console.log(user);
                //     console.log(err);

                //     if (err) {
                //         return next(err);
                //     }

                //     return res.status(HTTPSTATUS.OK).json({
                //         message: "Logged in successfully",
                //         user,
                //     });
                // });//1

                const access_token = signJwtToken({ userId: user._id }, { secret: config.JWT_SECRET });
                return res.status(HTTPSTATUS.OK).json({
                    message: "Looged in successfully",
                    access_token,
                    user
                })

            }
        )(req, res, next);
    }
);

// logout controller
// export const logOutController = asyncHandler(async (req: Request, res: Response) => {
//     req.logout((err) => {
//         if (err) {
//             console.error("Logout error:", err);
//             return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
//                 message: "Logout failed",
//                 error: err.message,
//             });
//         }

//         // Destroy the session
//         req.session.destroy((sessionErr) => {
//             if (sessionErr) {
//                 console.error("Session destruction error:", sessionErr);
//                 return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
//                     message: "Session cleanup failed",
//                     error: sessionErr.message,
//                 });
//             }

//             // Clear cookie from client
//             res.clearCookie("session");

//             return res.status(HTTPSTATUS.OK).json({
//                 message: "Logged out successfully",
//             });
//         });
//     });
// });


export const logOutController = asyncHandler(
    async (req: Request, res: Response) => {
        return res
            .status(HTTPSTATUS.OK)
            .json({ message: "Logged out successfully" });
    }
);
