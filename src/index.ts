import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
// import session from "cookie-session";
// import session from "express-session";//1
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { BadRequestException } from "./utils/appError";
import { ErrorCodeEnum } from "./enums/error-code.enum";
import MongoStore from "connect-mongo";

import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticatedMiddleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoute from "./routes/project.route";
import taskRoutes from "./routes/task.route";
import { passportAuthenticateJWT } from "./config/passport.config";
const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
// app.use(cookieParser());
app.use(
    cors({
        origin: config.FRONTEND_ORIGIN,
        credentials: true,
    })
);
app.use(express.urlencoded({ extended: true }));

// app.use(
//     session({
//         name: "session",
//         keys: [config.SESSION_SECRET],
//         maxAge: 24 * 60 * 60 * 1000,
//         secure: config.NODE_ENV === "production",
//         httpOnly: true,
//         sameSite: "none",
//     })
// );

// cookie storage
// app.use(
//     session({
//         name: "session",
//         secret: config.SESSION_SECRET,
//         resave: false,
//         saveUninitialized: false,
//         store: MongoStore.create({
//             mongoUrl: config.MONGO_URL, 
//             collectionName: "sessions",
//             ttl: 7 * 24 * 60 * 60, 
//         }),
//         cookie: {
//             maxAge: 7 * 24 * 60 * 60 * 1000,
//             httpOnly: true,
//             secure: config.NODE_ENV === "production",
//             sameSite: "lax",
//         },
//     })
// ); //1

app.use(passport.initialize());
// app.use(passport.session());// 1

// test route
app.get(
    `/`,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        throw new BadRequestException(
            "This is a bad request",
            ErrorCodeEnum.AUTH_INVALID_TOKEN
        );
        return res.status(HTTPSTATUS.OK).json({
            message: "Hello Subscribe to the channel & share",
        });
    })
);

// routes //1
// app.use(`${BASE_PATH}/auth`, authRoutes);
// app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
// app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
// app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
// app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoute);
// app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, passportAuthenticateJWT, userRoutes);
app.use(`${BASE_PATH}/workspace`, passportAuthenticateJWT, workspaceRoutes);
app.use(`${BASE_PATH}/member`, passportAuthenticateJWT, memberRoutes);
app.use(`${BASE_PATH}/project`, passportAuthenticateJWT, projectRoute);
app.use(`${BASE_PATH}/task`, passportAuthenticateJWT, taskRoutes);



app.use(errorHandler);

// server listen
app.listen(config.PORT, async () => {
    console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
    await connectDatabase();
});