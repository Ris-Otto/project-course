import { Hono } from "npm:hono";
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
import { Artist, ArtistMembersMapping } from "./Database/Model/Artist.ts";
import { Member } from "./Database/Model/Member.ts";
import { Venue } from "./Database/Model/Venue.ts";
import { Media } from "./Database/Model/Media.ts";
import { Role } from "./Database/Model/Role.ts";
import { Review } from "./Database/Model/Review.ts";
import userController from "./Controllers/UserController.ts";
import authController from "./Controllers/AuthController.ts";
import artistController from "./Controllers/ArtistController.ts";
import venueController from "./Controllers/VenueController.ts";
import { logRequestInfo } from "./Middleware/LoggerMiddleware.ts";
import { forceSyncDatabaseAndSetupTestData } from "./Utilities.ts";

const app = new Hono<{ Variables: JwtVariables }>();

console.log(config);

if (!config.ORIGIN) throw new Error("No host defined");

Event.belongsTo(Pricing);
Event.belongsTo(Venue);
Event.belongsToMany(Artist, {
  through: { model: EventMapping, unique: false },
});
Event.belongsTo(Bio);
Event.hasMany(Review);

Member.belongsToMany(Artist, {
  through: { model: ArtistMembersMapping, unique: false },
});
Member.hasMany(Role);

Artist.belongsToMany(Member, {
  through: { model: ArtistMembersMapping, unique: false },
});
Artist.belongsToMany(Event, {
  through: { model: EventMapping, unique: false },
});
Artist.belongsToMany(User, {
  through: { model: ArtistFollowing, unique: false },
});
Artist.belongsTo(Bio);
Artist.hasMany(Review);

Venue.belongsToMany(User, {
  through: { model: VenueFollowing, unique: false },
});
Venue.belongsTo(Bio);
Venue.hasMany(Review);
Venue.hasMany(Event);

User.belongsToMany(Artist, {
  through: { model: ArtistFollowing, unique: false },
});
User.belongsToMany(Venue, {
  through: { model: VenueFollowing, unique: false },
});

Bio.hasMany(Media);

//await forceSyncDatabaseAndSetupTestData();

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

Deno.serve(app.fetch);
