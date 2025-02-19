import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import * as tokenMiddleware from "../Middleware/JWTMiddleware.ts";
import Event from "../Database/Model/Event.ts";
import { NotFound, Ok, Unauthorized } from "../../Shared/Result.ts";
import { Artist, Role } from "../Database/Model/Artist.ts";
import { Bio } from "../Database/Model/Bio.ts";
import { Link } from "../Database/Model/Link.ts";
import { Member } from "../Database/Model/Member.ts";

import { deleteCookie } from "npm:hono/cookie";

import {
  includeBio,
  includeEvent,
  includeMember,
} from "../Database/framework.ts";
import sequelize from "../Database/database.ts";
import { Media } from "../Database/Model/Media.ts";

const artistController = new Hono();
artistController.get("/all", getArtists);
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

artistController.get("/", tokenMiddleware.verifyIsBand, self);

artistController.post("/search", searchArtists);

async function getArtists(c: Context) {
  const artists = (await Artist.findAll({
    include: [includeBio()],
    attributes: {
      exclude: ["password", "createdAt", "updatedAt"],
    },
  })).map((e) => e.get({ plain: true }));
  return c.json(Ok(artists));
}

async function publishAnnouncement(c: Context) {}

async function updateMembers(c: Context) {}

async function updateArtist(c: Context) {
  const payload = c.get("tokenPayload");
  const data = await c.req.json();
  const {
    name,
    email,
    bio,
    members,
    genre,
    images,
    links,
  } = data;

  const artist = await Artist.findByPk(payload.id);

  if (!artist) {
    return c.json(NotFound());
  }

  const artistUpdateRes = await artist.update({
    name: name,
    email: email,
    genre: genre,
  });

  const bioRes = await artistUpdateRes.getBio();
  if (!bioRes) {
    const newBio = await Bio.create({ description: bio });
    await artistUpdateRes.update({ BioId: newBio.id });
  } else {
    await bioRes.update({ description: bio });
  }

  for (const member of members) {
    await Member.upsert(
      {
        name: member.name,
        id: member.id,
      },
    );
    await Role.upsert({
      MemberId: member.id,
      ArtistId: artist.id,
      role: member.role,
    });
  }

  return c.json(
    Ok(artistUpdateRes.reload({ include: [Member, Event, Bio, Media, Link] })),
  );
}

async function rateVenue(c: Context) {}

async function getEventAndStatistics(c: Context) {}

async function uploadMedia(c: Context) {}

async function registerForEvent(c: Context) {}

async function getArtistProfile(c: Context) {
  const pk = c.req.param("artistId");
  const artist = await Artist.findByPk(pk, {
    include: [includeEvent(), Bio, Member],
    attributes: {
      exclude: ["password", "createdAt", "updatedAt", "BioId"],
    },
  });
  if (artist === null) {
    return c.json(NotFound());
  }
  return c.json(Ok(artist.get({ plain: true })));
}

async function self(c: Context) {
  const payload = c.get("tokenPayload");
  const user = await Artist.findOne({
    where: {
      email: payload.email,
      id: payload.id,
    },
    include: [Member, Event],
    attributes: { exclude: ["password", "verified"] },
  }).then((a) => (a === null ? null : a.get({ plain: true })));
  if (!user) {
    deleteCookie(c, "access_token");

    return c.json(Unauthorized());
  }
  return c.json(Ok(user));
}

async function searchArtists(c: Context) {
  const body = await c.req.json();
  const lookupValue = body.searchValue;

  const results = await Artist.findAll({
    limit: 10,
    where: {
      name: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("name")),
        "LIKE",
        "%" + lookupValue + "%",
      ),
    },
  });

  if (results.length === 0) return c.json(NotFound());
  const ret = results.map((a) => {
    return { value: a.id, label: a.name };
  });
  return c.json(Ok(ret));
}

export default artistController;
