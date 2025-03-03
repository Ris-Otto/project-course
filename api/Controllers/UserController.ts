import type { Context } from "npm:hono";
import { Hono } from "npm:hono";
import Event from "../Database/Model/Event.ts";
import * as tokenMiddleware from "../Middleware/JWTMiddleware.ts";
import {
  InternalError,
  NotFound,
  Ok,
  Unauthorized,
} from "../../Shared/Result.ts";
import Pricing from "../Database/Model/Pricing.ts";
import { User } from "../Database/Model/User.ts";
import { Artist } from "../Database/Model/Artist.ts";
import { Venue } from "../Database/Model/Venue.ts";
import {
  includeArtist,
  includeBio,
  includeModel,
} from "../Database/framework.ts";
import { deleteCookie } from "npm:hono/cookie";
import { Task } from "../Utilities.ts";
import { EventInterest } from "../Database/Model/EventInterest.ts";
import { getPoster } from "./Extensions/Extensions.ts";
import { Post } from "../Database/Model/Post.ts";
import { Op } from "npm:sequelize";

const userController = new Hono();

userController.get("/events", getEvents);
userController.get("/event/:eventId", getEvent);
userController.get("/user", tokenMiddleware.verifyIsUser, getUser);
userController.get(
  "/user/venues/following",
  tokenMiddleware.verifyIsUser,
  getFollowedVenus,
);
userController.get(
  "/user/artists/following",
  tokenMiddleware.verifyIsUser,
  getFollowedArtists,
);
userController.post(
  "/user/venues/follow/:venueId",
  tokenMiddleware.verifyIsUser,
  followVenue,
);
userController.post(
  "/user/artists/follow/:artistId",
  tokenMiddleware.verifyIsUser,
  followArtist,
);

userController.get(
  "/user/artists/following/posts/recent",
  tokenMiddleware.verifyIsUser,
  getRecentPosts,
);

userController.post(
  "/user/venues/unfollow/:venueId",
  tokenMiddleware.verifyIsUser,
  unfollowVenue,
);
userController.post(
  "/user/artists/unfollow/:artistId",
  tokenMiddleware.verifyIsUser,
  unfollowArtist,
);

userController.post(
  "/user/events/:eventId/show-interest",
  tokenMiddleware.verifyIsUser,
  showInterest,
);

userController.get(
  "/user/interest/:eventId",
  tokenMiddleware.verifyIsUser,
  getEventInterest,
);

async function getEventInterest(c: Context) {
  const payload = c.get("tokenPayload");
  const eventId = c.req.param("eventId");

  const res = await EventInterest.findOne({
    where: {
      UserId: payload.id,
      EventId: eventId,
    },
  });

  if (!res) return c.json(NotFound());

  return c.json(Ok(res));
}

async function getRecentPosts(c: Context) {
  const payload = c.get("tokenPayload");
  const user = await User.findByPk(payload.id);
  if (!user) {
    return c.json(NotFound());
  }

  const artists = await user.getArtists();
  const ids = artists.map((a) => a.id);

  const posts = await Post.findAll({
    where: {
      ArtistId: { [Op.in]: ids },
    },
    include: [includeBio()],
    order: [["createdAt", "DESC"]],
  });

  return c.json(Ok(posts));
}

async function getEvents(c: Context) {
  //const { offset } = await c.req.json();
  const events = await Event.findAll({
    include: [
      includeModel({
        model: Pricing,
        exclude: ["createdAt", "updatedAt"],
      }),
      includeModel({
        model: Venue,
        exclude: [
          "password",
          "verified",
          "contactEmail",
          "contactName",
          "createdAt",
          "updatedAt",
        ],
      }),
      includeBio(),
    ],
    attributes: {
      exclude: ["VenueId", "PricingId", "createdAt", "updatedAt"],
    },
    limit: 20,
    offset: 0,
    order: [["start", "DESC"]],
  });
  const ret = events.map((event) => event.get({ plain: true }));
  return c.json(Ok(ret));
}

async function getEvent(c: Context) {
  const id = c.req.param("eventId");
  const event = await Event.findByPk(id, {
    include: [
      includeModel({
        model: Pricing,
      }),
      includeModel({
        model: Venue,
        exclude: ["password", "verified", "contactEmail", "contactName"],
        include: includeBio(),
      }),
      includeArtist(),
      includeBio(),
    ],
    attributes: {
      exclude: ["VenueId", "PricingId", "Artists"],
    },
  });

  if (event === null) {
    return c.json(NotFound());
  }
  const ret = event.get({ plain: true });
  return c.json(Ok({ ...ret, poster: getPoster(event) }));
}

async function getUser(c: Context) {
  //TODO pagination
  const payload = c.get("tokenPayload");
  const user = await User.findOne({
    where: {
      email: payload.email,
      id: payload.id,
    },
    attributes: { exclude: ["password", "verified"] },
  }).then((a) => (a === null ? null : a.get({ plain: true })));
  if (!user) {
    deleteCookie(c, "access_token");

    return c.json(Unauthorized());
  }
  return c.json(Ok(user));
}

async function getFollowedVenus(c: Context) {
  //TODO pagination
  const payload = c.get("tokenPayload");
  const user = await User.findOne({
    where: {
      email: payload.email,
      id: payload.id,
    },
  });
  if (!user) return c.json(NotFound());
  const venues = await user.getVenues();
  return c.json(Ok(venues));
}

async function getFollowedArtists(c: Context) {
  //TODO pagination
  const payload = c.get("tokenPayload");
  const user = await User.findOne({
    where: {
      email: payload.email,
      id: payload.id,
    },
  });
  if (!user) return c.json(NotFound());
  const artists = await user.getArtists();
  return c.json(Ok(artists));
}

async function followArtist(c: Context) {
  const payload = c.get("tokenPayload");
  const artistId = c.req.param("artistId");
  const user = await User.findOne({
    where: {
      email: payload.email,
      id: payload.id,
    },
  });
  if (!user) return c.json(NotFound());
  const add = await user.addArtist(artistId);
  if (!add) return c.json(InternalError() /*or not found*/);
  return c.json(Ok(add));
}

async function unfollowArtist(c: Context) {
  const payload = c.get("tokenPayload");
  const artistId = c.req.param("artistId");
  const user = await User.findOne({
    where: {
      email: payload.email,
      id: payload.id,
    },
  });
  if (!user) return c.json(NotFound());
  const add = await user.removeArtist(artistId);
  if (!add) return c.json(InternalError() /*or not found*/);
  return c.json(Ok({ id: artistId }));
}

async function followVenue(c: Context) {
  const payload = c.get("tokenPayload");
  const venueId = c.req.param("venueId");
  const user = await User.findOne({
    where: {
      email: payload.email,
      id: payload.id,
    },
  });
  if (!user) return c.json(NotFound());
  const add = await user.addVenue(venueId);
  if (!add) return c.json(InternalError() /*or not found*/);
  return c.json(Ok(add));
}

async function unfollowVenue(c: Context) {
  const payload = c.get("tokenPayload");
  const venueId = c.req.param("venueId");
  const user = await User.findOne({
    where: {
      email: payload.email,
      id: payload.id,
    },
  });
  if (!user) return c.json(NotFound());
  const add = await user.removeVenue(venueId);
  return c.json(Ok(add));
}

async function showInterest(c: Context) {
  const payload = c.get("tokenPayload");
  const eventId = c.req.param("eventId");
  const { interest_level } = await c.req.json();
  const event = await Event.findByPk(eventId);
  if (!event) {
    return c.json(NotFound("event"));
  }
  const user = await User.findByPk(payload.id);
  if (!user) {
    return c.json(NotFound("user"));
  }
  const interest = await EventInterest.upsert({
    EventId: eventId,
    UserId: payload.id,
    interest: interest_level,
  });
  return c.json(Ok(interest));
}

export default userController;
