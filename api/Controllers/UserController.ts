import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import Event from "../Database/Model/Event.ts";
import * as tokenMiddleware from "../Middleware/JWTMiddleware.ts"
import { Ok } from "../../Shared/Result.ts";
import Pricing from "../Database/Model/Pricing.ts";
import { Venue } from "../Database/Model/User.ts";


const users = new Hono();

users.get("/events", getEvents);
users.get("/", tokenMiddleware.verifyIsUser, getUser);
users.get("/venues/following", tokenMiddleware.verifyIsUser, getFollowedVenus);
users.get("/artists/following", tokenMiddleware.verifyIsUser, getFollowedArtists);
users.post("/venues/follow/:venueId", tokenMiddleware.verifyIsUser, followVenue);
users.post("/artists/follow/:venueId", tokenMiddleware.verifyIsUser, followArtist);

async function getEvents(c: Context) {
    const events = await Event.findAll({include: [
            {model: Pricing},
            {model: Venue, attributes: { exclude: ["password", "verified", "contactEmail", "contactName"]}}
        ]});

    return c.json(Ok(events));
}

async function getUser(c: Context) {}

async function getFollowedVenus(c: Context) {}

async function getFollowedArtists(c: Context) {}

async function followArtist(c: Context) {}

async function followVenue(c: Context) {}

export default users;
