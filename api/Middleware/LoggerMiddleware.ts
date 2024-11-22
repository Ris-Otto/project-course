import type { Context, Next } from "npm:hono";
import {
  green,
  magenta,
  red,
  yellow,
} from "https://deno.land/std@0.77.0/fmt/colors.ts";
import { dl, flushLogger } from "../Utils/logger.ts";

export async function logRequestInfo(c: Context, next: Next) {
  try {
    await next();
    const id = c.get("requestId");
    const { method, path } = c.req;
    const response = c.res.clone();
    dl.info(
      `--> ${methodColour(method)} ${path} (request id: ${id}) ${
        statusColour(response.status)
      }`,
      await response.json(),
    );
  } catch (e) {
    dl.error(e);
  } finally {
    flushLogger();
  }
}

function methodColour(method: string) {
  switch (method) {
    case "GET":
      return green(String(method));
    case "POST":
      return yellow(String(method));
    case "PUT":
      return magenta(String(method));
    default:
      return green(String(method));
  }
}

function statusColour(status: number) {
  switch (status) {
    case 200:
      return green(String(status));
    case 500:
      return red(String(status));
    case 401:
      return magenta(String(status));
    default:
      return green(String(status));
  }
}
