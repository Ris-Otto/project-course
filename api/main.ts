import { Hono } from 'npm:hono'
import { prettyJSON } from 'npm:hono/pretty-json'
import type { JwtVariables } from "npm:hono/jwt";
import { cors } from 'npm:hono/cors';
import * as config from "./config.ts";
import Event from "./Database/Model/Event.ts";
import Pricing from "./Database/Model/Pricing.ts";
import { User } from "./Database/Model/User.ts";
import EventMapping from "./Database/Model/EventMapping.ts";
import { ArtistFollowing, VenueFollowing } from "./Database/Model/Following.ts";
import {Bio } from "./Database/Model/Bio.ts";
import { ArtistMembersMapping, Artist } from "./Database/Model/Artist.ts";
import { Member } from "./Database/Model/Member.ts";
import { Venue } from "./Database/Model/Venue.ts";
import userController from "./Controllers/UserController.ts";
import authController from "./Controllers/AuthController.ts";
import artistController from "./Controllers/ArtistController.ts";
import venueController from "./Controllers/VenueController.ts";
import { forceSyncDatabaseAndSetupTestData } from "./Utilities.ts";
import { Media } from "./Database/Model/Media.ts";
import { Role } from "./Database/Model/Role.ts";


type Variables = JwtVariables

const app = new Hono<{ Variables: Variables }>()

if(!config.ORIGIN) throw new Error("No host defined");

Event.belongsTo(Pricing);
Event.belongsTo(Venue);
Event.belongsToMany(Artist, {through: { model: EventMapping, unique: false } });
Event.belongsTo(Bio);

Member.belongsToMany(Artist, { through: { model: ArtistMembersMapping, unique: false } });

Artist.belongsToMany(Member, { through: { model: ArtistMembersMapping, unique: false } });
Artist.belongsToMany(Event, {through: { model: EventMapping, unique: false } });
Artist.belongsToMany(User, { through: { model: ArtistFollowing, unique: false } });
Artist.belongsTo(Bio);

Venue.belongsToMany(User, { through: { model: VenueFollowing, unique: false } });
Venue.belongsTo(Bio);

User.belongsToMany(Artist, { through: { model: ArtistFollowing, unique: false } });
User.belongsToMany(Venue, { through: { model: VenueFollowing, unique: false } });

Media.belongsTo(Bio);

Member.hasMany(Role);


//await forceSyncDatabaseAndSetupTestData();

app.use('*', (c, next) => {
  const corsMiddlewareHandler = cors({
    origin: config.ORIGIN,
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true,
  })
  return corsMiddlewareHandler(c, next)
})
app.use(prettyJSON())

app.route("/", userController);
app.route("/auth", authController);
app.route("/artist", artistController);
app.route("/venue", venueController);


Deno.serve(app.fetch)
