import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import { User } from "../Database/Model/User.ts";
import { Ok, Unauthorized } from "../../Shared/Result.ts";
import {
  generateJWTAccessToken,
  verifyAndDecodeToken,
  verifyJWTAccessToken,
} from "../Middleware/JWTMiddleware.ts";
import { deleteCookie, getCookie, setCookie } from "npm:hono/cookie";
import { dl } from "../Utils/logger.ts";
import { Venue } from "../Database/Model/Venue.ts";
import { Artist } from "../Database/Model/Artist.ts";

const auth = new Hono();

auth.post("/", authenticate);
auth.post("/register", registerUser);
auth.post("/register/band", registerBand);
auth.post("/venue/register", registerVenue);
auth.post("/login", login);
auth.post("/logout", logout);
auth.post("verify/user/:id", verifyUser);
auth.post("verify/artist/:id", verifyArtist);
auth.post("verify/venue/:id", verifyVenue);

function registerBand(c: Context) {
  //TODO
  return c.text("");
}

async function registerVenue(c: Context) {
  const venue = await c.req.json<Venue>();
  const dbRes = await Venue
    .create({ ...venue, verified: 1, country: "FI" })
    .then((data) => data.get({ plain: true }));
  //TODO send confirm email email
  return c.json(Ok(dbRes));
}

async function authenticate(c: Context) {
  const payload = getCookie(c, "access_token");
  if (!payload) return c.text("no token");
  const token = await verifyAndDecodeToken(payload);

  if (token === null) {
    return c.json(Unauthorized());
  }

  return c.json(Ok(token));
}

async function registerUser(c: Context) {
  const { name, email, password } = await c.req.json<User>();
  const dbRes = await User
    .create({ name: name, email: email, password: password, verified: 0 })
    .then((data) => data.get({ plain: true }));
  dl.info("User: {@a}", dbRes);
  //TODO send confirm email email
  return c.json(Ok(dbRes));
}

async function login(c: Context) {
  const { email, password } = await c.req.json<User>();

  let user: User | Venue | Artist | null = await User.findOne({
    where: { email: email },
  });

  if (user) {
    const ret = await checkLogin(c, user, password);
    return c.json(ret);
  }

  user = await Artist.findOne({ where: { email: email } });
  if (user) {
    const ret = await checkLogin(c, user, password);
    return c.json(ret);
  }

  user = await Venue.findOne({ where: { email: email } });
  if (user) {
    const ret = await checkLogin(c, user, password);
    return c.json(ret);
  }
}

async function checkLogin(
  c: Context,
  user: User | Venue | Artist,
  password: string,
) {
  const auth = await user.authenticate(password);
  if (!auth) {
    return Unauthorized("Invalid email or password");
  }
  if (user instanceof User) {
    if (!user.verified) {
      //TODO send confirm email email
      return Unauthorized("Invalid email or password");
    }
  }

  const payload = await generateJWTAccessToken(user);

  setCookie(c, "access_token", payload);
  const type = user instanceof User ? 0 : user instanceof Artist ? 1 : 2;
  return Ok({ name: user.name, email: user.email, type: type });
}

async function logout(c: Context) {
  const payload = getCookie(c, "access_token");
  if (!payload) return c.json(Unauthorized());
  if (!(await verifyJWTAccessToken(payload))) {
    return c.json(Unauthorized());
  }
  deleteCookie(c, "access_token");
  return c.json(Ok());
}

/*TODO
   simple email verification stuff idk probably decode some jwt token with arbitrary data
   sent as link to registered email
*/
async function verifyUser(c: Context) {}

//TODO how
async function verifyArtist(c: Context) {}

//TODO how
async function verifyVenue(c: Context) {}

export default auth;
