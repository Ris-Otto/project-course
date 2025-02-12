import { decode, sign, verify } from "npm:hono/jwt";
import * as config from "../config.ts";
import { ResolveUserType, UserType } from "../../Shared/Types.ts";
import type { Context, Next } from "npm:hono";
import { getCookie } from "npm:hono/cookie";
import { Unauthorized } from "../../Shared/Result.ts";

export function generateJWTAccessToken(user: UserType) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    type: ResolveUserType(user),
    exp: Date.now() + Number(config.JWT_EXP),
  };

  return sign(payload, config.JWT_SECRET);
}

export function verifyJWTAccessToken(payload: string) {
  return verify(payload, config.JWT_SECRET);
}

export async function verifyAndDecodeToken(payload: string) {
  try {
    await verify(payload, config.JWT_SECRET);
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error message: " + err.message);
    }
    return null;
  }
  const decodedToken = decode(payload);
  return decodedToken.payload;
}

async function verifyAccessToken(c: Context) {
  const access_token = getCookie(c, "access_token");
  if (!access_token) {
    console.log(`User doesn't have a valid access_token`);
    return null;
  }
  const tokenPayload = await verifyAndDecodeToken(access_token);
  if (!tokenPayload) {
    console.log(`User doesn't have a valid access_token`);
    return null;
  }
  c.set("tokenPayload", tokenPayload);
  return tokenPayload;
}

export async function verifyIsBand(c: Context, next: Next) {
  const token = await verifyAccessToken(c);
  if (token === null) {
    return c.json(Unauthorized(), 401);
  }
  if (Number(token.type) !== 1) {
    return c.json(Unauthorized(), 401);
  }
  await next();
}

export async function verifyIsVenue(c: Context, next: Next) {
  const token = await verifyAccessToken(c);
  if (token === null) {
    return c.json(Unauthorized(), 401);
  }
  if (Number(token.type) !== 2) {
    return c.json(Unauthorized(), 401);
  }
  await next();
}

export async function verifyIsUser(c: Context, next: Next) {
  const token = await verifyAccessToken(c);
  if (token === null) {
    return c.json(Unauthorized(), 401);
  }
  if (Number(token.type) !== 0) {
    return c.json(Unauthorized(), 401);
  }
  await next();
}

export async function verifyIsRegistered(c: Context, next: Next) {
  const token = await verifyAccessToken(c);
  if (token === null) {
    return c.json(Unauthorized(), 401);
  }
  if (Number(token.type) > 0) {
    return c.json(Unauthorized(), 401);
  }
  await next();
}
