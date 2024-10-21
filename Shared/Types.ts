// @ts-ignore
import {Artist, User, Venue} from "../api/Database/Model/User.ts";

export type UserType = User | Venue | Artist;

export type UserPayload = {
    id: number;
    name: string;
    email: string;
    type: number;
    exp: number;
}

export function ResolveUserType(user: UserType) {
    if(user instanceof User) {
        return 0;
    } else if (user instanceof Artist) {
        return 1;
    }
    return 2;
}