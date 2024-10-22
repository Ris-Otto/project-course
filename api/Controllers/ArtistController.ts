import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import * as tokenMiddleware from  "../Middleware/JWTMiddleware.ts";


const artistController = new Hono();

artistController.use(tokenMiddleware.verifyIsBand);

artistController.post("/announcements/publish", publishAnnouncement);
artistController.post("/members/update", updateMembers);
artistController.post("/update", updateArtist);
artistController.post("/rate/:venueId", rateVenue);
artistController.get("/event/:eventId", getEventAndStatistics);
artistController.post("/media/upload", uploadMedia);
artistController.post("/event/register/:eventId", registerForEvent);

async function publishAnnouncement(c: Context) {}

async function updateMembers(c: Context) {}

async function updateArtist(c: Context) {}

async function rateVenue(c: Context) {}

async function getEventAndStatistics(c: Context) {}

async function uploadMedia(c: Context) {}

async function registerForEvent(c: Context) {}

export default artistController;