import { Sequelize } from "npm:sequelize";
import * as config from "../config.ts";

const sequelize = new Sequelize(
  config.MYSQL_DB,
  config.MYSQL_USER,
  config.MYSQL_PASSWORD,
  {
    host: config.MYSQL_HOST,
    port: Number(config.MYSQL_PORT),
    dialect: "mysql",
    logging: false,
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
  });

export default sequelize;
