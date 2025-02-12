import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import * as tokenMiddleware from "../Middleware/JWTMiddleware.ts";
import {
  includeBio,
  includeEvent,
  includeVenue,
} from "../Database/framework.ts";
import { getCookie, setCookie } from "npm:hono/cookie";
import { NotFound, Ok, Unauthorized } from "../../Shared/Result.ts";
import { Venue } from "../Database/Model/Venue.ts";
import Event from "../Database/Model/Event.ts";
import { Bio } from "../Database/Model/Bio.ts";
import Pricing from "../Database/Model/Pricing.ts";
import { Media } from "../Database/Model/Media.ts";
import { Link } from "../Database/Model/Link.ts";
import { OpeningHour } from "../Database/Model/OpeningHour.ts";
import { dl } from "../Utils/logger.ts";
import sequelize from "../Database/database.ts";
import { Artist } from "../Database/Model/Artist.ts";

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
venueController.post("/update", tokenMiddleware.verifyIsVenue, updateVenue);

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
    await Media.create({ internal: false, href: media, BioId: bioRes.id });
  }

  const pricingRes = await Pricing.create({ ...pricing }).then((data) =>
    data.get({ plain: true })
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
  await event.update({
    name: name,
    age: age,
    start: start,
    end: end,
  });

  await pricing?.update({ ...newPricing });
  await bio?.update({ description: newBio.description });
  console.log(data.bio.media);
  if (newBio.media) {
    await Media.destroy({ where: { BioId: bio?.id } });
    for (const media of data.bio.media) {
      await Media.create({ internal: false, href: media, BioId: bio?.id });
    }
  }

  return c.json(Ok(event));
}

async function cancelEvent(c: Context) {
  const payload = c.get("tokenPayload");

  const eventId = c.req.param("eventId");
  const event = await Event.findOne({ where: { id: eventId } });

  if (!event) return c.text("found no event");
  if (event.VenueId != payload.id) return c.text("does not own the event");

  const updatedEvent = await event.update({ cancelled: 1 });
  return c.json(Ok(updatedEvent));
}

async function rateArtist(c: Context) {}

async function updateBio(c: Context) {
  const payload = c.get("tokenPayload");
  const data = await c.req.json();
  const venue = await Venue.findOne({
    where: { id: payload.id },
  });
  if (!venue) return c.json(NotFound());
  if (venue.BioId === null) {
    const bio = await Bio.create({ description: data.bio });
    await updateMediaAndLinks(data, bio.id);
    await venue.update({ BioId: bio.id });
    return c.json(Ok(bio));
  } else {
    const bio = await Bio.findOne({
      where: {
        id: venue.BioId,
      },
    });
    if (bio === null) return c.json(NotFound());
    const updatedBio = await bio.update({ description: data.bio });
    await updateMediaAndLinks(data, updatedBio.id);
    const reloadedBio = await updatedBio.reload({ include: [Media, Link] });
    return c.json(Ok(reloadedBio));
  }
}

async function updateMediaAndLinks(data: any, bioId: number) {
  if (data.media) {
    for (const media of data.media) {
      await Media.create({
        internal: false,
        href: media.image_link,
        BioId: bioId,
      });
    }
  }
  if (data.urls) {
    for (const link of data.urls) {
      await Link.create({ url: link.url, BioId: bioId });
    }
  }
}

async function uploadMedia(c: Context) {
  const media = await Media.create({ internal: false, href: "lmao" });
  return c.json(Ok(media));
}

async function getVenue(c: Context) {
  const payload = c.get("tokenPayload");
  const venue = await Venue.findOne({
    where: {
      email: payload.email,
      id: payload.id,
    },
    include: [includeBio(), includeEvent(), OpeningHour],
  });
  if (venue === null) return c.json(NotFound());

  return c.json(Ok(venue.get({ plain: true })));
}

async function getVenueProfile(c: Context) {
  const pk = c.req.param("venueId");
  const venue = await Venue.findByPk(pk, {
    include: includeEvent(),
    attributes: {
      exclude: ["password", "createdAt", "updatedAt", "BioId"],
    },
  });
  if (venue === null) {
    return c.json(NotFound());
  }

  return c.json(Ok(venue.get({ plain: true })));
}

async function updateVenue(c: Context) {
  const payload = c.get("tokenPayload");
  const body = await c.req.json();
  const { name, addr, zip, city, hrs, phone } = body;

  const venue = await Venue.findOne({
    where: {
      email: payload.email,
      id: payload.id,
    },
  });
  if (!venue) return c.json(NotFound());

  const venueUpdate = await venue.update({
    name: name,
    address: addr,
    zip: zip,
    city: city,
    phone: phone,
  });

  await upsertOpeningHours(venue.id, {
    monStart: hrs.mon.from,
    monEnd: hrs.mon.to,
    tueStart: hrs.tue.from,
    tueEnd: hrs.tue.to,
    wedStart: hrs.wed.from,
    wedEnd: hrs.wed.to,
    thuStart: hrs.thu.from,
    thuEnd: hrs.thu.to,
    friStart: hrs.fri.from,
    friEnd: hrs.fri.to,
    satStart: hrs.sat.from,
    satEnd: hrs.sat.to,
    sunStart: hrs.sun.from,
    sunEnd: hrs.sun.to,
  });
  const ret = await venueUpdate.reload({
    include: [includeBio(), includeEvent(), OpeningHour],
  });

  return c.json(Ok(ret));
}
async function upsertOpeningHours(
  venueId: string,
  hours: Record<string, string>,
) {
  // Merge hours and ensure correct structure
  const fieldsToUpsert = {
    VenueId: venueId,
    ...hours,
  };

  // Upsert the record: Updates the row if VenueId already exists
  await OpeningHour.upsert(fieldsToUpsert);
}

export default venueController;
