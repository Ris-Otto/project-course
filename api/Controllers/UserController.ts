import { Hono } from "npm:hono";
import {User} from "../Database/Model/User.ts";
import {Ok, Response, Unauthorized} from "../../Shared models/Result.ts";


const users = new Hono();


users.post("/register", async (c) => {
    const { name, email, password } = await c.req.json<User>();
    //TODO handle the three different user types: regular, band, venue
    //Band and venue will have to be handled differently since they actually need to be verified and not just email verification
    const dbRes = await User
        .create({name, email, password, active: 0})
        .then(data => data.get({ plain: true }));


    return c.json(Ok(dbRes, "User registered"));
})

users.post("/login", async (c) => {
    const { email, password } = await c.req.json<User>();
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        return c.json(Unauthorized(null,"Invalid email or password"));
    }
    if(!user.authenticate(password)) {
        return c.json(Unauthorized(null,"Invalid email or password"));
    }
    if(!user.active) {
        return c.json(Unauthorized(null, "Please confirm you email"))
    }
    return c.json(Ok(user));
})

users.post("/confirm", async (c) => {

})

export default users;
