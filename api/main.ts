import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import { serveStatic } from "hono/deno";
import { requestId } from "npm:hono/request-id";
import { prettyJSON } from "npm:hono/pretty-json";
import type { JwtVariables } from "npm:hono/jwt";
import { cors } from "npm:hono/cors";
import * as config from "./config.ts";
import Event from "./Database/Model/Event.ts";
import Pricing from "./Database/Model/Pricing.ts";
import { User } from "./Database/Model/User.ts";
import EventMapping from "./Database/Model/EventMapping.ts";
import { ArtistFollowing, VenueFollowing } from "./Database/Model/Following.ts";
import { Bio } from "./Database/Model/Bio.ts";
import { Artist, Role } from "./Database/Model/Artist.ts";
import { Member } from "./Database/Model/Member.ts";
import { Venue } from "./Database/Model/Venue.ts";
import { Media } from "./Database/Model/Media.ts";
import { Review } from "./Database/Model/Review.ts";
import userController from "./Controllers/UserController.ts";
import authController from "./Controllers/AuthController.ts";
import artistController from "./Controllers/ArtistController.ts";
import venueController from "./Controllers/VenueController.ts";
import { logRequestInfo } from "./Middleware/LoggerMiddleware.ts";
import { Post } from "./Database/Model/Post.ts";
import { EventInterest } from "./Database/Model/EventInterest.ts";
import { OpeningHour } from "./Database/Model/OpeningHour.ts";
import { alterSyncDatabase } from "./Utilities.ts";
import { Link } from "./Database/Model/Link.ts";
import { PlayRequest } from "./Database/Model/PlayRequest.ts";

const app = new Hono<{ Variables: JwtVariables }>();

if (!config.ORIGIN) throw new Error("No host defined");

Event.belongsTo(Pricing);
Event.belongsTo(Venue);
Event.belongsToMany(Artist, {
  through: { model: EventMapping, unique: false },
});
Event.belongsTo(Bio);
Event.hasMany(Review);
Event.hasMany(PlayRequest);

Event.hasMany(EventInterest);

Member.belongsToMany(Artist, {
  through: { model: Role, unique: false },
});

Artist.belongsToMany(Member, {
  through: { model: Role, unique: false },
});
Artist.belongsToMany(Event, {
  through: { model: EventMapping, unique: false },
});
Artist.belongsToMany(User, {
  through: { model: ArtistFollowing, unique: false },
});
Artist.belongsTo(Bio);
Artist.hasMany(Review);

Post.belongsTo(Artist);
Artist.hasMany(Post);
Artist.hasMany(PlayRequest);

Venue.belongsToMany(User, {
  through: { model: VenueFollowing, unique: false },
});
Venue.belongsTo(Bio);
Venue.hasMany(Review);
Venue.hasMany(Event);
Venue.hasOne(OpeningHour);
Venue.hasMany(Post);
Venue.hasMany(PlayRequest);

PlayRequest.belongsTo(Venue);
PlayRequest.belongsTo(Artist);
PlayRequest.belongsTo(Event);

User.belongsToMany(Artist, {
  through: { model: ArtistFollowing, unique: false },
});
User.belongsToMany(Venue, {
  through: { model: VenueFollowing, unique: false },
});

User.hasMany(EventInterest);

Bio.hasMany(Media);

Post.belongsTo(Bio);

Link.belongsTo(Bio, { foreignKey: "BioId", onDelete: "CASCADE" }); // A Link belongs to a Bio
Bio.hasMany(Link, { foreignKey: "BioId", onDelete: "CASCADE" }); // A Bio has many Links

await alterSyncDatabase();

app.use("*", (c, next) => {
  const corsMiddlewareHandler = cors({
    origin: config.ORIGIN,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  });
  return corsMiddlewareHandler(c, next);
});
app.use(prettyJSON());

app.use("*", requestId());
app.use(logRequestInfo);

app.route("/", userController);
app.route("/auth", authController);
app.route("/artist", artistController);
app.route("/venue", venueController);
app.get("/uploads/*", serveStatic({ root: "./" }));

Deno.serve(app.fetch);
