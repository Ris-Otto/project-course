import type {Context} from "npm:hono";
import {Hono} from "npm:hono";
import Event from "../Database/Model/Event.ts";
import * as tokenMiddleware from "../Middleware/JWTMiddleware.ts"
import {NotFound, Ok} from "../../Shared/Result.ts";
import Pricing from "../Database/Model/Pricing.ts";

import type {ModelStatic, Model} from 'sequelize'
import {User} from "../Database/Model/User.ts";
import {dl} from "../Utils/logger.ts";
import {Artist} from "../Database/Model/Artist.ts";
import {Member} from "../Database/Model/Member.ts";
import {Venue} from "../Database/Model/Venue.ts";
import {Role} from "../Database/Model/Role.ts";
import {includeArtist, includeModel} from "../Utilities.ts";


const userController = new Hono();

userController.get("/events", getEvents);
userController.get("/event/:eventId", getEvent)
userController.get("/user", tokenMiddleware.verifyIsUser, getUser);
userController.get("/user/venues/following", tokenMiddleware.verifyIsUser, getFollowedVenus);
userController.get("/user/artists/following", tokenMiddleware.verifyIsUser, getFollowedArtists);
userController.post("/user/venues/follow/:venueId", tokenMiddleware.verifyIsUser, followVenue);
userController.post("/user/artists/follow/:venueId", tokenMiddleware.verifyIsUser, followArtist);

async function getEvents(c: Context) {

    const events = (await Event.findAll({
        include: [
            includeModel(
                {
                    model: Pricing,
                    exclude: ["createdAt", "updatedAt"]
                }
            ), includeModel
            (
                {
                    model: Venue,
                    exclude: ["password", "verified", "contactEmail", "contactName","createdAt", "updatedAt"]
                }
            )
        ],
        attributes: {
            exclude: ["VenueId", "PricingId","createdAt", "updatedAt"]
        }
    })).map(e => e.get({plain: true}));
    return c.json(Ok(events));
}

async function getEvent(c: Context) {
    const id = c.req.param("eventId");
    const event = (await Event.findByPk(id, {
        include: [
            includeModel(
                {
                    model: Pricing
                }
            ), includeModel
            (
                {
                    model: Venue,
                    exclude: ["password", "verified", "contactEmail", "contactName"]
                }
            ),
            includeArtist()
        ],
        attributes: {
            exclude: ["VenueId", "PricingId", "Artists"]
        }
    }));

    if(event === null) {
        return c.json(NotFound())
    }
    const ret = event.get({plain: true});
    return c.json(Ok(ret));
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
                includeModel(
                    {
                        model: Artist,
                        exclude: ["password"],
                        excludeMapping: true,
                    }
                ), includeModel({
                    model: Venue,
                    exclude: ["password"],
                    excludeMapping: true
                })],
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

export default userController;
