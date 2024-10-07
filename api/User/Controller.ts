import { Hono } from "npm:hono";
import User from "../Database/Model/User.ts";
import {Ok, Result, Unauthorized} from "../../Shared models/Result.ts";


const users = new Hono();


users.post("/register", async (c) => {
    const { name, email, type, password } = await c.req.json<User>();

    const dbRes = await User
        .create({name, email, type, password})
        .then(data => data.get({ plain: true }));


    return c.json(new Result<User>(10, "User registered", dbRes));
})

users.post("/login", async (c) => {
    const { email, password } = await c.req.json<User>();
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        return c.json(Unauthorized("Invalid email or password"));
    }
    if(!user.authenticate(password)) {
        return c.json(Unauthorized("Invalid email or password"));
    }
    return c.json(Ok(user));
})

export default users;
