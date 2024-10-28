import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import Event from "../Database/Model/Event.ts";
import * as tokenMiddleware from "../Middleware/JWTMiddleware.ts"
import {NotFound, Ok} from "../../Shared/Result.ts";
import Pricing from "../Database/Model/Pricing.ts";

import type { ModelStatic } from 'sequelize'
import {Artist, Member, User, Venue} from "../Database/Model/User.ts";
import {dl} from "../Utils/logger.ts";


const users = new Hono();

const defaultGetModel = (model:  ModelStatic<any>, include?:  ModelStatic<any>): any => {

    return include ? {
        model: model,
        attributes: { exclude:["password"]},
        through: {
            attributes: []
        },
        include: [defaultGetModel(include)]
    } : {
        model: model,
        attributes: { exclude:["password"]},
        through: {
            attributes: []
        },
    }
}

users.get("/events", getEvents);
users.get("/", tokenMiddleware.verifyIsUser, getUser);
users.get("/venues/following", tokenMiddleware.verifyIsUser, getFollowedVenus);
users.get("/artists/following", tokenMiddleware.verifyIsUser, getFollowedArtists);
users.post("/venues/follow/:venueId", tokenMiddleware.verifyIsUser, followVenue);
users.post("/artists/follow/:venueId", tokenMiddleware.verifyIsUser, followArtist);

async function getEvents(c: Context) {

    const events = (await Event.findAll({ include: [
            {model: Pricing},
            {model: Venue, attributes: { exclude: ["password", "verified", "contactEmail", "contactName"]}}
        ]})).map(e => e.get({plain: true}));
    dl.info("\nEvents: {@a}", events)
    return c.json(Ok(events));
}

async function getUser(c: Context) {
    const payload = c.get("tokenPayload");
    const user = await User.findOne(
        {
            where: {
                email: payload.email,
                id: payload.id,
            },
            include: [
                defaultGetModel(Artist, Member), defaultGetModel(Venue)],
            attributes: { exclude: ["password", "verified"] },
        }).then(a => a === null ? null : a.get({plain: true}));
    return c.json(Ok(user));
}

async function getFollowedVenus(c: Context) {}

async function getFollowedArtists(c: Context) {}

async function getArtist(c: Context) {
    const pk = c.req.param('id');
    const artist = await Artist.findByPk(pk);
    if(artist === null) return c.text("!bajsbajs");
    return c.json(Ok(
        artist.get({plain: true})
    ));
}

async function followArtist(c: Context) {}

async function followVenue(c: Context) {}

export default users;
