import { Hono } from 'npm:hono'
import { prettyJSON } from 'npm:hono/pretty-json'
import { cors } from 'npm:hono/cors';
import * as config from "./config.ts";
import Event from "./Database/Model/Event.ts";
import Pricing from "./Database/Model/Pricing.ts";
import users from "./User/Controller.ts";

const app = new Hono();

if(!config.HOST) throw new Error("No host defined");

Event.belongsTo(Pricing);

//import sequelize from "./Database/database.ts";
//await sequelize.sync({ force: true });
//await sequelize.sync({ alter: true });

app.use("/*", cors({
  origin: config.HOST,
  credentials: true,
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(prettyJSON())

app.route("/user", users);


Deno.serve(app.fetch)
