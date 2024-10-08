import {Sequelize} from "sequelize";
import * as config from "../config.ts";

const sequelize = new Sequelize(`musicdb`, config.MYSQL_USER, config.MYSQL_PASSWORD, { host: config.MYSQL_HOST, dialect: "mysql" });

export default sequelize;



