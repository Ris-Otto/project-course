import * as log from "https://deno.land/std/log/mod.ts";

await log.setup({
    //define handlers
    handlers: {
        console: new log.ConsoleHandler("DEBUG", {
            formatter: rec => JSON.stringify({ts: rec.datetime, level: rec.levelName, data: rec.msg})
        }),
        },
    //assign handlers to loggers
    loggers: {
        default: {
            level: "INFO",
            handlers: ["file"]
        }
    },
});

export const dl=log.getLogger();