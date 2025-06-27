import { SignOptions } from "jsonwebtoken";
import { UserDocument } from "../models/user.model"
import { config } from "../config/app.config";
import jwt from "jsonwebtoken"

export type AccessPayload = {
    userId: UserDocument["_id"];
}

type SignOptsAndsecret = SignOptions & {
    secret: string;
}

const defaults: SignOptions = {
    audience: ['user']
}


export const accessTokenSignOptions: SignOptsAndsecret = {
    expiresIn: config.JWT_EXPIRES_IN as any,
    secret: config.JWT_SECRET
}


export const signJwtToken = (
    payload: AccessPayload,
    options: SignOptsAndsecret
) => {
    const { secret, ...opts } = options || accessTokenSignOptions
    return jwt.sign(payload, secret, {
        ...defaults,
        ...opts,
    })
}


