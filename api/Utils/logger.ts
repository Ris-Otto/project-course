import * as log from "https://deno.land/std/log/mod.ts";
import {cyan, green, magenta} from "https://deno.land/std@0.224.0/fmt/colors.ts";

function parseStringTemplate(template: string, args: any[]) {
    const regexp = /(\{(.*?)})/g;
    const matches = template.matchAll(regexp);
    const matchArr = matches.toArray();
    if(matchArr.length === 0) {
        if(args.length === 0)
            return template;
        throw new Error("Improperly formatted template string");
    }

    if(matchArr.length !== args.length) throw new Error("Improperly formatted template string");

    matchArr.forEach((a, i) => {
        if(isEmptyObject(args[i])) {
            template = template.replace(a[0], "{ }");
        }
        template = template.replace(a[0], handleArgType(args[i]));
    })
    return template;
}

function handleArgType(arg: any, level: number = 0): string {
    switch (typeof arg) {
        case "string":
            return green(`"${arg}"`);
        case "object":
            if(arg instanceof Date)
                return cyan(arg.toISOString());
            return handleStringJson(arg,level);
        case "symbol":
            return green(String(arg));
        case "number":
            return magenta(String(arg));
        default:
            return String(arg);
    }
}

function handleStringJson(originalJson: Record<string, {}>, level: number) {
    const retThing: string[] = [];
    const bracerSpace = new Array(level + 1).join(" ");
    const numSpaces = new Array(level + 2).join(" ");

    for (const [key, value] of Object.entries(originalJson)) {

        if(isEmptyObject(value)) {
            retThing.push("\n"+ (numSpaces) + handleArgType(key, level + 2) + ": " + "{ }");
            continue;
        }
        retThing.push("\n"+ numSpaces + handleArgType(key, level + 2) + ": " + handleArgType(value, level + 2));
    }

    const a = retThing.toString();
    return (`{`)
        .concat(a)
        .concat("\n")
        .concat(bracerSpace)
        .concat(`}`)
        ;
}

function isEmptyObject(value: any) {
    if (value == null) {
        // null or undefined
        return false;
    }

    if (typeof value !== 'object') {
        // boolean, number, string, function, etc.
        return false;
    }

    const proto = Object.getPrototypeOf(value);

    // consider `Object.create(null)`, commonly used as a safe map
    // before `Map` support, an empty object as well as `{}`
    if (proto !== null && proto !== Object.prototype) {
        return false;
    }

    return isEmpty(value);
}

function isEmpty(obj: object) {
    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }

    return true
}

log.setup({
    //define handlers
    handlers: {
        stringTemplateFmt: new log.ConsoleHandler("DEBUG", {
            formatter: (record) => {
                const ret = parseStringTemplate(record.msg, record.args);
                return `[${record.levelName}] ${ret}`
            }
        }),
    },
    //assign handlers to loggers
    loggers: {
        default: {
            level: "DEBUG",
            handlers: ["stringTemplateFmt"]
        }
    },
});

export const dl=log.getLogger();