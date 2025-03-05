import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import * as tokenMiddleware from "../Middleware/JWTMiddleware.ts";
import Event from "../Database/Model/Event.ts";
import {
  Aborted,
  InternalError,
  NotFound,
  Ok,
  Unauthorized,
} from "../../Shared/Result.ts";
import { Artist, Role } from "../Database/Model/Artist.ts";
import { Bio } from "../Database/Model/Bio.ts";
import { Link } from "../Database/Model/Link.ts";
import { Member } from "../Database/Model/Member.ts";

import { deleteCookie } from "npm:hono/cookie";

import { includeBio, includeEvent } from "../Database/framework.ts";
import sequelize from "../Database/database.ts";
import { Media } from "../Database/Model/Media.ts";
import { PlayRequest } from "../Database/Model/PlayRequest.ts";
import { Review } from "../Database/Model/Review.ts";
import { Post } from "../Database/Model/Post.ts";
import { storage } from "../storage.ts";
import {
  updateImages,
  updateLinks,
  updateMembers,
} from "./Extensions/Extensions.ts";

const artistController = new Hono();
artistController.get("/all", getArtists);
artistController.post(
  "/posts/publish",
  tokenMiddleware.verifyIsBand,
  publishAnnouncement,
);

artistController.post(
  "/posts/:postId/images",
  tokenMiddleware.verifyIsBand,
  storage.multiple("media[]"),
  updatePostImages,
);

artistController.post("/update", tokenMiddleware.verifyIsBand, updateArtist);
artistController.post(
  "/rate/:eventId/:venueId",
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
  storage.multiple("media[]"),
  uploadMedia,
);

artistController.post(
  "bio/update/poster",
  tokenMiddleware.verifyIsBand,
  storage.single("poster"),
  updatePoster,
);

artistController.post(
  "/event/register/:eventId",
  tokenMiddleware.verifyIsBand,
  registerForEvent,
);
artistController.get("/public/:artistId", getArtistProfile);

artistController.get("/", tokenMiddleware.verifyIsBand, self);

artistController.post("/search", searchArtists);

artistController.get("/posts/:artistId", getPosts);

artistController.post(
  "/posts/update/:postId",
  tokenMiddleware.verifyIsBand,
  updatePost,
);

artistController.get(
  "/posts/:artistId/:postId",
  getPost,
);

async function getPosts(c: Context) {
  try {
    const artistId = c.req.param("artistId");

    const posts = await Post.findAll({
      where: {
        ArtistId: artistId,
      },
      include: [includeBio()],
    });

    return c.json(Ok(posts));
  } catch (e) {
    console.log(e);
    return c.json(InternalError());
  }
}

async function getPost(c: Context) {
  try {
    const artistId = c.req.param("artistId");
    const postId = c.req.param("postId");
    const post = await Post.findOne({
      where: {
        id: postId,
        ArtistId: artistId,
      },
      include: [includeBio()],
    });

    if (!post) {
      return c.json(NotFound());
    }

    return c.json(Ok(post.get({ plain: true })));
  } catch (e) {
    console.log(e);
    return c.json(InternalError());
  }
}

async function updatePostImages(c: Context) {
  const files = c.var.files["media[]"];
  const postId = c.req.param("postId");
  const payload = c.get("tokenPayload");
  if (!files) return c.json(Ok());
  try {
    const ret = await updateImages(Post, files, postId, {
      parentModelId: payload.id,
    });
    return c.json(ret);
  } catch (e) {
    console.log(e);
    return c.json(InternalError());
  }
  /*const post = await Post.findByPk(postId, {
    include: [Bio],
  });

  if (!post) {
    return c.json(NotFound());
  }
  if (Array.isArray(files)) {
    for (const file of files) {
      await upsertMedia(payload.id, post.BioId, file);
    }
  } else {
    await upsertMedia(payload.id, post.BioId, files);
  }

  return c.json(Ok());*/
}

async function updatePost(c: Context) {
  try {
    const postId = c.req.param("postId");
    const payload = c.get("tokenPayload");
    const { text, name, published } = await c.req.json();

    const [updated] = await Post.upsert({
      id: postId,
      ArtistId: payload.id,
      text: text,
      name: name,
      published: published,
    });

    if (!updated) return c.json(Ok());

    return c.json(Ok(updated.get({ plain: true })));
  } catch (e) {
    console.log(e);
    return c.json(InternalError());
  }
}

async function updatePoster(c: Context) {
  const file = c.var.files["poster"];
  const payload = c.get("tokenPayload");
  if (!file) return c.json(Ok());
  try {
    const ret = await updateImages(Artist, file, payload.id, {
      isPoster: true,
    });
    return c.json(ret);
  } catch (e) {
    console.log(e);
    return c.json(InternalError());
  }
  /*const artist = await Artist.findByPk(payload.id, { include: [Bio] });
  if (!artist) {
    return c.json(NotFound());
  }
  await upsertMedia(payload.id, artist.BioId, file, true);
  return c.json(Ok());*/
}

async function getArtists(c: Context) {
  try {
    const artists = (await Artist.findAll({
      include: [includeBio()],
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    })).map((e) => e.get({ plain: true }));
    return c.json(Ok(artists));
  } catch (e) {
    console.log(e);
    return c.json(InternalError());
  }
}

async function publishAnnouncement(c: Context) {
  try {
    const { text, name } = await c.req.json();
    const payload = c.get("tokenPayload");

    const bio = await Bio.create({});

    const post = await Post.create({
      text: text,
      ArtistId: payload.id,
      BioId: bio.id,
      name: name,
      published: true,
    });

    return c.json(Ok(post.get({ plain: true })));
  } catch (e) {
    console.log(e);
    return c.json(InternalError());
  }
}

async function updateArtist(c: Context) {
  try {
    const payload = c.get("tokenPayload");
    const data = await c.req.json();
    const {
      name,
      email,
      bio,
      members,
      genre,
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
      const oldLinks = await newBio.getLinks();
      await updateLinks(newBio.id, links, oldLinks);
    } else {
      await bioRes.update({ description: bio });
      const oldLinks = await bioRes.getLinks();
      await updateLinks(bioRes.id, links, oldLinks);
    }
    const oldMembers = await artist.getMembers();
    await updateMembers(oldMembers, members, payload.id);

    return c.json(
      Ok(
        await artistUpdateRes.reload({
          include: [Member, Event, { model: Bio, include: [Media, Link] }],
        }).then((a) => {
          return (a.get({ plain: true }));
        }),
      ),
    );
  } catch (e) {
    console.log(e);
    return c.json(InternalError());
  }
}

async function rateVenue(c: Context) {
  const payload = c.get("tokenPayload");
  const venueId = c.req.param("venueId");
  const eventId = c.req.param("eventId");
  const { description, score } = await c.req.json();

  try {
    const response = await Review.create({
      VenueId: venueId,
      ArtistId: payload.id,
      EventId: eventId,
      score: score,
      description: description,
      reviewer_type: 0,
    });
    return c.json(Ok(response, "Review submitted"));
  } catch (e: any) {
    if (e.name === "SequelizeUniqueConstraintError") {
      return c.json(
        Aborted(null, "You have already reviewed this venue/event combination"),
      );
    }
  }
}

async function getEventAndStatistics(c: Context) {}

async function uploadMedia(c: Context) {
  const files = c.var.files["media[]"];
  const payload = c.get("tokenPayload");
  if (!files) return c.json(Ok());
  try {
    const ret = await updateImages(Artist, files, payload.id, {
      parentModelId: payload.id,
    });
    return c.json(ret);
  } catch (e) {
    console.log(e);
    return c.json(InternalError(null, "Something went wrong"));
  }
  /*const artist = await Artist.findByPk(payload.id, {
    include: [Bio],
  });

  if (!artist) {
    return c.json(NotFound());
  }

  for (const file of files) {
    await upsertMedia(payload.id, artist.BioId, file);
  }

  const allMedia = await artist.Bio.getMedia();

  await deleteMedia(files, allMedia, payload.id, artist.BioId);

  return c.json(Ok());*/
}

async function registerForEvent(c: Context) {}

async function getArtistProfile(c: Context) {
  try {
    const pk = c.req.param("artistId");
    const artist = await Artist.findByPk(pk, {
      include: [includeEvent(), includeBio(), Member, {
        model: Post,
        include: [includeBio()],
      }],
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });
    if (artist === null) {
      return c.json(NotFound());
    }

    return c.json(
      Ok(artist.get({ plain: true })),
    );
  } catch (e) {
    console.log(e);
    return c.json(InternalError());
  }
}

async function self(c: Context) {
  try {
    const payload = c.get("tokenPayload");
    const artist = await Artist.findOne({
      where: {
        email: payload.email,
        id: payload.id,
      },
      include: [Member, includeBio(), includeEvent(), PlayRequest, Review],
      attributes: { exclude: ["password", "verified"] },
    }).then((a) => (a === null ? null : a.get({ plain: true })));
    if (!artist) {
      deleteCookie(c, "access_token");

      return c.json(Unauthorized());
    }

    return c.json(
      Ok(artist),
    );
  } catch (e) {
    console.log(e);
    return c.json(InternalError());
  }
}

async function searchArtists(c: Context) {
  try {
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
  } catch (e) {
    console.log(e);
    return c.json(InternalError());
  }
}

export default artistController;
