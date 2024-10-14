import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import Event from "../Database/Model/Event.ts";
import * as tokenMiddleware from "../Middleware/JWTMiddleware.ts"
import { Ok } from "../../Shared/Result.ts";


const users = new Hono();

users.use(tokenMiddleware.verifyAccessToken)

users.get("/events", getEvents);

async function getEvents(c: Context) {
    console.log(c.get("tokenPayload"));
    return c.json(Ok(await Event.findAll({ where: { id: 1 }})));
}

export default users;
