import { Hono } from "npm:hono";
import {Ok, Response, Unauthorized} from "../../Shared models/Result.ts";


const venues = new Hono();