import "jsr:@std/dotenv/load";

const env = Deno.env.toObject()
const MYSQL_HOST = env.MYSQL_HOST;
const MYSQL_USER = env.MYSQL_USER;
const MYSQL_PASSWORD = env.MYSQL_PASSWORD;
const HOST = env.HOST;


export {
    HOST,
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
};

