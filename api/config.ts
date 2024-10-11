import "jsr:@std/dotenv/load";

const env = Deno.env.toObject()
const MYSQL_HOST = env.MYSQL_HOST;
const MYSQL_USER = env.MYSQL_USER;
const MYSQL_PASSWORD = env.MYSQL_PASSWORD;
const ORIGIN = env.ORIGIN;

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXP = env.JWT_EXP;


export {
    ORIGIN,
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
    JWT_SECRET,
    JWT_EXP
};

