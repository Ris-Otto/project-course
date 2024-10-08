import { Hono } from 'npm:hono'
import { prettyJSON } from 'npm:hono/pretty-json'
import { cors } from 'npm:hono/cors';
import * as config from "./config.ts";
import Event from "./Database/Model/Event.ts";
import Pricing from "./Database/Model/Pricing.ts";
import {Artist, ArtistMembersMapping, Member, Venue} from "./Database/Model/User.ts";
import EventMapping from "./Database/Model/EventMapping.ts";
import users from "./Controllers/UserController.ts";

const app = new Hono();

if(!config.ORIGIN) throw new Error("No host defined");

Event.belongsTo(Pricing);
Event.belongsTo(Venue);

Member.belongsToMany(Artist, { through: ArtistMembersMapping});
Artist.belongsToMany(Member, { through: ArtistMembersMapping });

Event.belongsToMany(Artist, {through: EventMapping });
Artist.belongsToMany(Event, {through: EventMapping });

//import sequelize from "./Database/database.ts";
//await sequelize.sync({ alter: true });
//await sequelize.sync({ force: true });

app.use('*', (c, next) => {
  const corsMiddlewareHandler = cors({
    origin: config.ORIGIN,
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  })
  return corsMiddlewareHandler(c, next)
})
app.use(prettyJSON())

app.route("/user", users);


Deno.serve(app.fetch)
