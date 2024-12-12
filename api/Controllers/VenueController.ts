import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import * as tokenMiddleware from "../Middleware/JWTMiddleware.ts";
import { includeBio, includeEvent } from "../Database/framework.ts";
import { getCookie, setCookie } from "npm:hono/cookie";
import { NotFound, Ok, Unauthorized } from "../../Shared/Result.ts";
import { Venue } from "../Database/Model/Venue.ts";
import Event from "../Database/Model/Event.ts";
import { Bio } from "../Database/Model/Bio.ts";
import Pricing from "../Database/Model/Pricing.ts";
import { Media } from "../Database/Model/Media.ts";

const venueController = new Hono();

venueController.post(
  "/request/:artistId",
  tokenMiddleware.verifyIsVenue,
  requestArtist,
);
venueController.post("/event/add", tokenMiddleware.verifyIsVenue, addEvent);
venueController.post(
  "/event/:eventId/update",
  tokenMiddleware.verifyIsVenue,
  updateEvent,
);
venueController.post(
  "/event/:eventId/cancel",
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

async function addEvent(c: Context) {
  const payload = getCookie(c, "access_token");
  if (!payload) return c.text("no token");
  const token = await tokenMiddleware.verifyAndDecodeToken(payload);
  const event = await c.req.json();

  const bio = event.bio;
  const pricing = event.pricing;

  const name = event.name;
  const age = event.age || null;
  const start = event.start;
  const end = event.end;

  const bioRes = await Bio.create({ description: bio.description }).then(
    (data) => data.get({ plain: true }),
  );

  for (const media of bio.media) {
    Media.create({ internal: false, href: media, BioId: bioRes.id });
  }

  const pricingRes = await Pricing.create({ ...pricing }).then((data) =>
    data.get({ plain: true }),
  );

  const eventRes = await Event.create({
    name: name,
    age: age,
    start: start,
    end: end,
    cancelled: 0,
    VenueId: token!.id,
    BioId: bioRes.id,
    PricingId: pricingRes.id,
  }).then((data) => data.get({ plain: true }));
  return c.json(Ok(eventRes));
}

async function updateEvent(c: Context) {
  const data = await c.req.json();

  const payload = getCookie(c, "access_token");
  if (!payload) return c.text("no token");
  const token = await tokenMiddleware.verifyAndDecodeToken(payload);

  const eventId = c.req.param("eventId");
  const event = await Event.findOne({ where: { id: eventId } });

  if (!event) return c.text("found no event");
  if (event.VenueId != token!.id) return c.text("does not own the event");

  const name = data.name || event.name;
  const age = data.age || event.age;
  const start = data.start || event.start;
  const end = data.end || event.end;

  const pricing = await Pricing.findOne({ where: { id: event.PricingId } });
  const bio = await Bio.findOne({ where: { id: event.Bio.id } });

  const newPricing = {
    currency: data.pricing.currency || pricing?.currency,
    amount: data.pricing.amount || pricing?.amount,
    type: data.pricing.type || pricing?.type,
  };

  const newBio = {
    description: data.bio.description || bio?.description,
    media: data.bio.media || null,
  };
  console.log(newBio);
  event.update({
    name: name,
    age: age,
    start: start,
    end: end,
  });

  pricing?.update({ ...newPricing });
  bio?.update({ description: newBio.description });
  console.log(data.bio.media);
  if (newBio.media) {
    Media.destroy({ where: { BioId: bio?.id } });
    for (const media of data.bio.media) {
      Media.create({ internal: false, href: media, BioId: bio?.id });
    }
  }

  return c.json(Ok(event));
}

async function cancelEvent(c: Context) {
  const payload = getCookie(c, "access_token");
  if (!payload) return c.text("no token");
  const token = await tokenMiddleware.verifyAndDecodeToken(payload);

  const eventId = c.req.param("eventId");
  const event = await Event.findOne({ where: { id: eventId } });

  if (!event) return c.text("found no event");
  if (event.VenueId != token!.id) return c.text("does not own the event");

  event.update({ cancelled: 1 });
  return c.json(Ok(event));
}

async function rateArtist(c: Context) {}

async function updateBio(c: Context) {
  const payload = getCookie(c, "access_token");
  if (!payload) return c.text("no token");
  const data = await c.req.json();
  const token = await tokenMiddleware.verifyAndDecodeToken(payload);
  const venue = await Venue.findOne({ where: { id: token!.id } });
  console.log(venue?.Bio.id);
  var bio = await Bio.findOne({ where: { id: venue?.Bio.id } });
  if (bio) {
    const description = data.description || bio?.description;
    bio?.update({ description: description });
  } else {
    bio = await Bio.create({ description: data.description }).then((data) =>
      data.get({ plain: true }),
    );

    venue?.update({ BioId: bio?.id });
  }
  if (data.media) {
    Media.destroy({ where: { BioId: bio?.id } });
    for (const media of data.media) {
      Media.create({ internal: false, href: media, BioId: bio?.id });
    }
  }

  return c.json(Ok(bio));
}

async function uploadMedia(c: Context) {
  const media = await Media.create({ internal: false, href: "lmao" });
  return c.json(Ok(media));
}

async function getVenue(c: Context) {
  const events = (await Venue.findAll()).map((e) => e.get({ plain: true }));
  return c.json(Ok(events));
}

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
