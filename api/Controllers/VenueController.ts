import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import * as tokenMiddleware from  "../Middleware/JWTMiddleware.ts";


const venueController = new Hono();

venueController.use(tokenMiddleware.verifyIsVenue);

venueController.post("/request/:artistId", requestArtist);
venueController.post("/event/add", addEvent);
venueController.post("/event/update", updateEvent);
venueController.post("/event/cancel", cancelEvent);
venueController.post("/rate/:artistId", rateArtist);
venueController.post("/bio/update", updateBio);
venueController.post("/media/upload", uploadMedia);
venueController.get("/", getVenue);


async function requestArtist(c: Context) {}

async function addEvent(c: Context) {}

async function updateEvent(c: Context) {}

async function cancelEvent(c: Context) {}

async function rateArtist(c: Context) {}

async function updateBio(c: Context) {}

async function uploadMedia(c: Context) {}

async function getVenue(c: Context) {}

export default venueController;