import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import * as tokenMiddleware from  "../Middleware/JWTMiddleware.ts";
import {Artist, Member, Venue} from "../Database/Model/User.ts";
import Event from "../Database/Model/Event.ts";
import {NotFound, Ok} from "../../Shared/Result.ts";


const artistController = new Hono();

artistController.post("/announcements/publish", tokenMiddleware.verifyIsBand, publishAnnouncement);
artistController.post("/members/update", tokenMiddleware.verifyIsBand, updateMembers);
artistController.post("/update", tokenMiddleware.verifyIsBand, updateArtist);
artistController.post("/rate/:venueId", tokenMiddleware.verifyIsBand, rateVenue);
artistController.get("/event/:eventId", tokenMiddleware.verifyIsBand, getEventAndStatistics);
artistController.post("/media/upload", tokenMiddleware.verifyIsBand, uploadMedia);
artistController.post("/event/register/:eventId", tokenMiddleware.verifyIsBand, registerForEvent);
artistController.get("/public/:id", getArtistProfile);

async function publishAnnouncement(c: Context) {}

async function updateMembers(c: Context) {}

async function updateArtist(c: Context) {}

async function rateVenue(c: Context) {}

async function getEventAndStatistics(c: Context) {}

async function uploadMedia(c: Context) {}

async function registerForEvent(c: Context) {}

async function getArtistProfile(c: Context) {
    const pk = c.req.param('id');
    const artist = await Artist.findByPk(pk, {
        include: [
            {
                model: Event,
                through: {
                    attributes: []
                },
                attributes: {
                    exclude: [ "createdAt", "updatedAt"]
                },
                include: [
                    {
                        model: Venue,
                        attributes: { exclude: ["password", "createdAt", "updatedAt"]},
                    }
                ],
            },
            {
                model: Member,
                through: {
                    attributes: []
                },
                attributes: {
                    exclude: [ "createdAt", "updatedAt"]
                }
            }
        ],
        attributes: {
            exclude: ["password", "createdAt", "updatedAt"]
        }
    });
    if(artist === null) return c.json(NotFound());
    return c.json(Ok(
        artist.get({plain: true})
    ));
}

export default artistController;