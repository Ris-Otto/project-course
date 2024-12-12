import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import * as tokenMiddleware from "../Middleware/JWTMiddleware.ts";
import { includeBio, includeEvent } from "../Database/framework.ts";
import { NotFound, Ok } from "../../Shared/Result.ts";
import { Venue } from "../Database/Model/Venue.ts";
import Event from "../Database/Model/Event.ts";
import { Bio } from "../Database/Model/Bio.ts";

const venueController = new Hono();

venueController.post(
  "/request/:artistId",
  tokenMiddleware.verifyIsVenue,
  requestArtist,
);
venueController.post("/event/add", tokenMiddleware.verifyIsVenue, addEvent);
venueController.post(
  "/event/update",
  tokenMiddleware.verifyIsVenue,
  updateEvent,
);
venueController.post(
  "/event/cancel",
  tokenMiddleware.verifyIsVenue,
  cancelEvent,
);
venueController.post(
  "/rate/:artistId",
  tokenMiddleware.verifyIsVenue,
  rateArtist,
);
venueController.post("/bio/update", tokenMiddleware.verifyIsVenue, updateBio);
venueController.post(
  "/media/upload",
  tokenMiddleware.verifyIsVenue,
  uploadMedia,
);
venueController.get("/", tokenMiddleware.verifyIsVenue, getVenue);
venueController.get("/public/:venueId", getVenueProfile);

async function requestArtist(c: Context) {}

async function addEvent(c: Context) {}

async function updateEvent(c: Context) {}

async function cancelEvent(c: Context) {}

async function rateArtist(c: Context) {}

async function updateBio(c: Context) {}

async function uploadMedia(c: Context) {}

async function getVenue(c: Context) {}

async function getVenueProfile(c: Context) {
  const pk = c.req.param("venueId");
  const venue = await Venue.findByPk(pk, {
    include: [
      {
        model: Event,
        attributes: {
          exclude: ["password", "createdAt", "updatedAt", "BioId"],
        },
        include: [Venue],
      },
    ],
    attributes: {
      exclude: ["password", "createdAt", "updatedAt", "BioId"],
    },
  });
  if (venue === null) {
    return c.json(NotFound());
  }

  return c.json(Ok(venue.get({ plain: true })));
}

export default venueController;
