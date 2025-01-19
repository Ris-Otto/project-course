import { Sequelize } from "npm:sequelize";
import * as config from "../config.ts";

const sequelize = new Sequelize(
  `musicdb`,
  config.MYSQL_USER,
  config.MYSQL_PASSWORD,
  { host: config.MYSQL_HOST, dialect: "mysql", logging: false },
);

export default sequelize;
