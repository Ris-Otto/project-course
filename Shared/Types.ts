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