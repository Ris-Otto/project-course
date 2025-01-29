import sequelize from "../database.ts";
import { DataTypes, Model } from "npm:sequelize";

class OpeningHour extends Model {
  declare id: number;
  declare monStart: string;
  declare monEnd: string;
  declare tueStart: string;
  declare tueEnd: string;
  declare wedStart: string;
  declare wedEnd: string;
  declare thuStart: string;
  declare thuEnd: string;
  declare friStart: string;
  declare friEnd: string;
  declare satStart: string;
  declare satEnd: string;
  declare sunStart: string;
  declare sunEnd: string;
}

OpeningHour.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    day: {
      type: DataTypes.TINYINT.UNSIGNED,
    },
    monStart: {
      type: DataTypes.DATE,
    },
    monEnd: {
      type: DataTypes.DATE,
    },
    tueStart: {
      type: DataTypes.DATE,
    },
    tueEnd: {
      type: DataTypes.DATE,
    },
    wedStart: {
      type: DataTypes.DATE,
    },
    wedEnd: {
      type: DataTypes.DATE,
    },
    thuStart: {
      type: DataTypes.DATE,
    },
    thuEnd: {
      type: DataTypes.DATE,
    },
    friStart: {
      type: DataTypes.DATE,
    },
    friEnd: {
      type: DataTypes.DATE,
    },
    satStart: {
      type: DataTypes.DATE,
    },
    satEnd: {
      type: DataTypes.DATE,
    },
    sunStart: {
      type: DataTypes.DATE,
    },
    sunEnd: {
      type: DataTypes.DATE,
    },
  },
  { tableName: "opening_hours", sequelize: sequelize },
);

export { OpeningHour };
