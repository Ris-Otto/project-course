import {Artist, User, Venue} from "../Database/Model/User.ts";
import { decode, sign, verify } from "npm:hono/jwt";
import * as config from "../config.ts";

type UserType = User | Venue | Artist;


export function generateJWTAccessToken(user: UserType) {

    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        exp: Number(config.JWT_EXP),
    };

    return sign(payload, config.JWT_SECRET);
}

export function createJWTPayload(user: UserType) {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        exp: config.JWT_EXP,
    };
}

export function verifyJWTAccessToken(payload: string) {
    return verify(payload, config.JWT_SECRET);
}

