import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import * as tokenMiddleware from "../Middleware/JWTMiddleware.ts";
import Event from "../Database/Model/Event.ts";
import { NotFound, Ok } from "../../Shared/Result.ts";
import { Venue } from "../Database/Model/Venue.ts";
import { Artist } from "../Database/Model/Artist.ts";
import { Member } from "../Database/Model/Member.ts";
import { Role } from "../Database/Model/Role.ts";
import Pricing from "../Database/Model/Pricing.ts";

import {
  includeBio,
  includeEvent,
  includeMember,
  includeModel,
} from "../Database/framework.ts";
import { Bio } from "../Database/Model/Bio.ts";
import { Media } from "../Database/Model/Media.ts";

const artistController = new Hono();
artistController.get("/artists", getArtists);
artistController.post(
  "/announcements/publish",
  tokenMiddleware.verifyIsBand,
  publishAnnouncement,
);
artistController.post(
  "/members/update",
  tokenMiddleware.verifyIsBand,
  updateMembers,
);
artistController.post("/update", tokenMiddleware.verifyIsBand, updateArtist);
artistController.post(
  "/rate/:venueId",
  tokenMiddleware.verifyIsBand,
  rateVenue,
);
artistController.get(
  "/event/:eventId",
  tokenMiddleware.verifyIsBand,
  getEventAndStatistics,
);
artistController.post(
  "/media/upload",
  tokenMiddleware.verifyIsBand,
  uploadMedia,
);
artistController.post(
  "/event/register/:eventId",
  tokenMiddleware.verifyIsBand,
  registerForEvent,
);
artistController.get("/public/:artistId", getArtistProfile);

async function getArtists(c: Context) {
  const events = (await Artist.findAll()).map((e) => e.get({ plain: true }));
  return c.json(Ok(events));
}

async function publishAnnouncement(c: Context) {}

async function updateMembers(c: Context) {}

async function updateArtist(c: Context) {}

async function rateVenue(c: Context) {}

async function getEventAndStatistics(c: Context) {}

async function uploadMedia(c: Context) {}

async function registerForEvent(c: Context) {}

async function getArtistProfile(c: Context) {
  const pk = c.req.param("artistId");
  const artist = await Artist.findByPk(pk, {
    include: [
      includeEvent(),
      includeMember(),
      includeBio(),
    ],
    attributes: {
      exclude: ["password", "createdAt", "updatedAt", "BioId"],
    },
  });
  if (artist === null) {
    return c.json(NotFound());
  }
  return c.json(Ok(
    artist.get({ plain: true }),
  ));
}

export default artistController;
