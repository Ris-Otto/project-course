import type { Context } from "npm:hono";
import { Hono } from "npm:hono";
import * as tokenMiddleware from "../Middleware/JWTMiddleware.ts";
import {
  includeBio,
  includeEvent,
  includeOpeningHours,
} from "../Database/framework.ts";
import {
  Aborted,
  InternalError,
  NotFound,
  Ok,
  Unauthorized,
} from "../../Shared/Result.ts";
import { Venue } from "../Database/Model/Venue.ts";
import Event from "../Database/Model/Event.ts";
import { Bio } from "../Database/Model/Bio.ts";
import Pricing from "../Database/Model/Pricing.ts";
import { Media } from "../Database/Model/Media.ts";
import { Link } from "../Database/Model/Link.ts";
import { OpeningHour } from "../Database/Model/OpeningHour.ts";
import { Artist } from "../Database/Model/Artist.ts";
import { storage } from "../storage.ts";
import { updateImages } from "./Extensions/Extensions.ts";
import { PlayRequest } from "../Database/Model/PlayRequest.ts";
import { Review } from "../Database/Model/Review.ts";

const venueController = new Hono();

venueController.post(
  "/request/:artistId",
  tokenMiddleware.verifyIsVenue,
  requestArtist,
);
venueController.post("/event/add", tokenMiddleware.verifyIsVenue, addEvent);

venueController.post(
  "event/update/:eventId/poster",
  tokenMiddleware.verifyIsVenue,
  storage.single("poster"),
  addEventPoster,
);

venueController.post(
  "event/delete/:eventId",
  tokenMiddleware.verifyIsVenue,
  deleteEvent,
);

venueController.post(
  "/event/update/:eventId",
  tokenMiddleware.verifyIsVenue,
  updateEvent,
);
venueController.post(
  "event/publish/:eventId",
  tokenMiddleware.verifyIsVenue,
  publishEvent,
);
venueController.post(
  "/event/cancel/:eventId",
  tokenMiddleware.verifyIsVenue,
  cancelEvent,
);

venueController.post(
  "/rate/:eventId/:artistId",
  tokenMiddleware.verifyIsVenue,
  rateArtist,
);
venueController.post("/bio/update", tokenMiddleware.verifyIsVenue, updateBio);
venueController.post(
  "/media/upload",
  tokenMiddleware.verifyIsVenue,
  storage.multiple("media[]"),
  uploadMedia,
);

venueController.post("/update", tokenMiddleware.verifyIsVenue, updateVenue);

venueController.get("/", tokenMiddleware.verifyIsVenue, getVenue);
venueController.get("/public/:venueId", getVenueProfile);

venueController.get("/all", getVenues);

venueController.post(
  "bio/update/poster",
  tokenMiddleware.verifyIsVenue,
  storage.single("poster"),
  updatePoster,
);

async function deleteEvent(c: Context) {
  const payload = c.get("tokenPayload");
  const eventId = c.req.param("eventId");

  const del = await Event.destroy({
    where: {
      id: eventId,
      VenueId: payload.id,
      published: 0,
    },
  });

  if (del !== 1) {
    return c.json(Unauthorized());
  }
  return c.json(Ok());
}

async function uploadMedia(c: Context) {
  const files = c.var.files["media[]"];
  const payload = c.get("tokenPayload");
  if (!files) return c.json(Ok());
  try {
    const ret = await updateImages(Venue, files, payload.id);
    return c.json(ret);
  } catch {
    return c.json(InternalError());
  }
  /*const venue = await Venue.findByPk(payload.id, {
    include: [Bio],
  });

  if (!venue) {
    return c.json(NotFound());
  }

  for (const file of files) {
    await upsertMedia(payload.id, venue.BioId, file);
  }

  const allMedia = await venue.Bio.getMedia();

  await deleteMedia(files, allMedia, payload.id, venue.BioId);

  return c.json(Ok());*/
}

async function getVenues(c: Context) {
  const venues = (await Venue.findAll({
    include: [includeBio()],
    attributes: {
      exclude: ["password", "createdAt", "updatedAt"],
    },
  })).map((e) => e.get({ plain: true }));

  return c.json(Ok(venues));
}

async function requestArtist(c: Context) {
  const payload = c.get("tokenPayload");
  const venue = await Venue.findOne({
    where: { id: payload.id },
  });
  if (!venue) return c.json(NotFound());
}

async function publishEvent(c: Context) {
  const eventId = c.req.param("eventId");

  await Event.update({
    published: 1,
  }, {
    where: {
      id: eventId,
    },
  });

  return c.json(Ok());
}

async function addEvent(c: Context) {
  const payload = c.get("tokenPayload");
  const venue = await Venue.findByPk(payload.id);
  if (!venue) return c.json(NotFound());
  const event = await c.req.json();
  const {
    name,
    start,
    end,
    bio,
    //poster,
    address,
    city,
    zip,
    //capacity,
    artists,
    /*type,
    tags,*/
    published,
    amount,
    paymentMethod,
    age,
    location,
  } = event;

  const bioRes = await Bio.create({ description: bio }).then(
    (data) => data.get({ plain: true }),
  );

  const pricingRes = await Pricing.create({
    amount: amount,
    type: paymentMethod,
    currency: "EUR",
  });

  const loc = location && address !== venue.address;

  const eventRes = await Event.create({
    name: name,
    age: age,
    start: start,
    end: end,
    cancelled: 0,
    VenueId: payload.id,
    BioId: bioRes.id,
    PricingId: pricingRes.id,
    published: published,
    address: address,
    zip: zip,
    city: city,
    location: loc,
  }).then((data) => data.get({ plain: true }));

  for (const artist of artists) {
    const artistRes = await Artist.findByPk(artist);
    if (!artistRes) continue;
    await artistRes.addEvent(eventRes.id);
  }

  return c.json(Ok(eventRes));
}

async function addEventPoster(c: Context) {
  const file = c.var.files["poster"];
  const payload = c.get("tokenPayload");
  const eventId = c.req.param("eventId");
  if (!file) return c.json(Ok());
  try {
    const ret = await updateImages(Event, file, eventId, {
      parentModelId: payload.id,
      isPoster: true,
    });
    return c.json(ret);
  } catch (e) {
    console.log(e);
    return c.json(InternalError());
  }
  /*const event = await Event.findByPk(eventId, { include: [Bio] });
  if (!event) {
    return c.json(NotFound());
  }

  await upsertMedia(payload.id, event.BioId, file, true);

  return c.json(Ok());*/
}

async function updateEvent(c: Context) {
  const payload = c.get("tokenPayload");
  const venue = await Venue.findByPk(payload.id);
  if (!venue) return c.json(NotFound());
  const data = await c.req.json();
  const {
    name,
    start,
    end,
    bio,
    address,
    city,
    zip,
    //capacity,
    artists,
    //type,
    //tags,
    published,
    amount,
    paymentMethod,
    age,
    location,
  } = data;

  const eventId = c.req.param("eventId");
  const event = await Event.findOne({ where: { id: eventId } });
  if (!event) return c.json(NotFound());
  if (event.VenueId != payload.id) return c.json(Unauthorized());

  const pricing = await Pricing.findByPk(event.PricingId);
  const bioRes = await Bio.findByPk(event.BioId);

  const newPricing = {
    currency: pricing?.currency ? pricing.currency : "EUR",
    amount: amount || pricing?.amount,
    type: paymentMethod || pricing?.type,
  };

  const newBio = {
    description: bio ? bio : bioRes?.description || "",
    media: data.bio.media || null,
  };

  const loc = location && address !== venue.address;

  await event.update({
    name: name,
    age: age,
    start: start,
    end: end,
    published: published ? published : event.published,
    address: address,
    zip: zip,
    city: city,
    location: loc,
  });

  await pricing?.update({ ...newPricing });
  await bioRes?.update({ description: newBio.description });

  //DISCLAIMER for below: Probably shit
  const a = await event.getArtists();
  const artistIds = a.map((a) => a.id);

  //First, add artists to event that are present in request but not present in DB
  for (const artist of artists) {
    const artistRes = await Artist.findByPk(artist);
    if (!artistRes) continue;
    if (!artistIds.includes(artist)) {
      await artistRes.addEvent(eventId);
    }
  }

  //Then, remove artists from that are present in DB but not present in request
  for (const aa of a) {
    if (!artists.includes(aa.id)) {
      await aa.removeEvent(eventId);
    }
  }

  return c.json(Ok(event));
}

async function cancelEvent(c: Context) {
  const payload = c.get("tokenPayload");

  const eventId = c.req.param("eventId");
  const event = await Event.findOne({ where: { id: eventId } });

  if (!event) return c.json(NotFound(null, "found no event"));
  if (event.VenueId != payload.id) {
    return c.json(Unauthorized("does not own the event"));
  }

  const updatedEvent = await event.update({ cancelled: 1 });
  return c.json(Ok(updatedEvent));
}

async function rateArtist(c: Context) {
  const payload = c.get("tokenPayload");
  const artistId = c.req.param("artistId");
  const eventId = c.req.param("eventId");
  const { description, score } = await c.req.json();

  const [response] = await Review.upsert({
    VenueId: payload.id,
    ArtistId: artistId,
    EventId: eventId,
    score: score,
    description: description,
    reviewer_type: 0,
  });
  return c.json(Ok(response, "Review submitted"));
}

async function updatePoster(c: Context) {
  const file = c.var.files["poster"];
  const payload = c.get("tokenPayload");
  if (!file) return c.json(Ok());
  try {
    const ret = await updateImages(Venue, file, payload.id, { isPoster: true });
    return c.json(ret);
  } catch (e) {
    console.log(e);
    return c.json(InternalError());
  }
  /*const venue = await Venue.findByPk(payload.id, { include: [Bio] });
  if (!venue) {
    return c.json(NotFound());
  }

  await upsertMedia(payload.id, venue.BioId, file, true);

  return c.json(Ok());*/
}

async function updateBio(c: Context) {
  const payload = c.get("tokenPayload");
  const data = await c.req.json();
  const venue = await Venue.findOne({
    where: { id: payload.id },
  });
  if (!venue) return c.json(NotFound());
  if (venue.BioId === null) {
    const bio = await Bio.create({ description: data.bio });
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
    const reloadedBio = await updatedBio.reload({ include: [Media, Link] });
    return c.json(Ok(reloadedBio));
  }
}

async function _updateMediaAndLinks<
  TData extends { media: { data_url: string }[]; urls: { url: string }[] },
>(data: TData, bioId: number) {
  if (data.media) {
    for (const media of data.media) {
      await Media.upsert({
        internal: false,
        href: media.data_url,
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

async function getVenue(c: Context) {
  const payload = c.get("tokenPayload");
  const venue = await Venue.findOne({
    where: {
      email: payload.email,
      id: payload.id,
    },
    include: [
      includeBio(),
      includeOpeningHours(),
      includeEvent(),
      PlayRequest,
      Review,
    ],
    attributes: {
      exclude: ["createdAt", "updatedAt", "password"],
    },
  });
  if (venue === null) return c.json(NotFound());

  return c.json(
    Ok(venue.get({ plain: true })),
  );
}

async function getVenueProfile(c: Context) {
  const pk = c.req.param("venueId");
  const venue = await Venue.findByPk(pk, {
    include: [includeBio(), includeEvent(), OpeningHour],
    attributes: {
      exclude: ["password", "createdAt", "updatedAt"],
    },
  });
  if (venue === null) {
    return c.json(NotFound());
  }

  const ret = venue.get({ plain: true });
  return c.json(Ok(ret));
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
