import { Hono } from 'npm:hono'
import { prettyJSON } from 'npm:hono/pretty-json'
import type { JwtVariables } from "npm:hono/jwt";
import { cors } from 'npm:hono/cors';
import * as config from "./config.ts";
import Event from "./Database/Model/Event.ts";
import Pricing from "./Database/Model/Pricing.ts";
import {Artist, ArtistMembersMapping, Member, User, Venue} from "./Database/Model/User.ts";
import EventMapping from "./Database/Model/EventMapping.ts";
import users from "./Controllers/UserController.ts";
import authController from "./Controllers/AuthController.ts";
import {ArtistFollowing, VenueFollowing} from "./Database/Model/Following.ts";
import {Bio, VenueBio, ArtistBio} from "./Database/Model/Bio.ts";
import artistController from "./Controllers/ArtistController.ts";
import venueController from "./Controllers/VenueController.ts";
import {forceSyncDatabaseAndSetupTestData} from "./Utilities.ts";
import paths from "../Shared/paths.ts";

type Variables = JwtVariables

const app = new Hono<{ Variables: Variables }>()

if(!config.ORIGIN) throw new Error("No host defined");

Event.belongsTo(Pricing);
Event.belongsTo(Venue);

Member.belongsToMany(Artist, { through: { model: ArtistMembersMapping, unique: false } });
Artist.belongsToMany(Member, { through: { model: ArtistMembersMapping, unique: false } });

Event.belongsToMany(Artist, {through: { model: EventMapping, unique: false } });
Artist.belongsToMany(Event, {through: { model: EventMapping, unique: false } });

Artist.belongsToMany(User, { through: { model: ArtistFollowing, unique: false } });
User.belongsToMany(Artist, { through: { model: ArtistFollowing, unique: false } });

Venue.belongsToMany(User, { through: { model: VenueFollowing, unique: false } });
User.belongsToMany(Venue, { through: { model: VenueFollowing, unique: false } });

Bio.belongsToMany(Artist, { through: ArtistBio });
Bio.belongsToMany(Venue, { through: VenueBio });


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

app.route("/user", users);
app.route("/auth", authController);
app.route("/artist", artistController);
app.route("/venue", venueController);


Deno.serve(app.fetch)
