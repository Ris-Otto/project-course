import {Hono} from "npm:hono";
import type { Context, Next } from "npm:hono";
import {User} from "../Database/Model/User.ts";
import {Ok, Unauthorized} from "../../Shared/Result.ts";
import {generateJWTAccessToken, verifyAndDecodeToken, verifyJWTAccessToken} from "../Middleware/JWTMiddleware.ts";
import {
    getCookie,
    setCookie,
    deleteCookie,
} from 'npm:hono/cookie'


const auth = new Hono();

auth.post("/", authenticate, );
auth.post("/register", registerUser);
auth.post("/register/band", registerBand);
auth.post("/register/venue", registerVenue);
auth.post("/login", login);
auth.post("/logout", logout);

function registerBand(c: Context) {
    //TODO
    return c.text("");
}

function registerVenue(c: Context) {
    //TODO
    return c.text("");
}

async function authenticate (c: Context, next: Next) {
    const payload = getCookie(c, "access_token");
    if(!payload) return c.text("no token");
    const token = await verifyAndDecodeToken(payload);

    if(token === null) {
        return c.json(Unauthorized())
    }

    return c.json(Ok());
}

async function registerUser(c: Context) {
    const { name, email, password } = await c.req.json<User>();
    const dbRes = await User
        .create({name, email, password, active: 0})
        .then(data => data.get({ plain: true }));
    return c.json(Ok(dbRes));
}

async function login(c: Context) {
    const { email, password } = await c.req.json<User>();

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
        return c.json(Unauthorized("Invalid email or password"));
    }

    if(!user.authenticate(password)) {
        return c.json(Unauthorized("Invalid email or password"));
    }
    if(!user.active) {
        return c.json(Unauthorized("Please confirm you email"))
    }

    const payload = await generateJWTAccessToken(user);

    setCookie(c, "access_token", payload);
    return c.json(Ok({ name: user.name, email: user.email, type: 0}));
}

async function logout(c: Context) {

    const payload = c.get("jwtPayload");
    if(!(await verifyJWTAccessToken(payload)))
        return c.json(Unauthorized())
    deleteCookie(c, "access_token");
    return c.json(Ok());
}

export default auth;

