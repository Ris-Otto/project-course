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
  declare VenueId: string;
}

OpeningHour.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    monStart: {
      type: DataTypes.STRING(5),
    },
    monEnd: {
      type: DataTypes.STRING(5),
    },
    tueStart: {
      type: DataTypes.STRING(5),
    },
    tueEnd: {
      type: DataTypes.STRING(5),
    },
    wedStart: {
      type: DataTypes.STRING(5),
    },
    wedEnd: {
      type: DataTypes.STRING(5),
    },
    thuStart: {
      type: DataTypes.STRING(5),
    },
    thuEnd: {
      type: DataTypes.STRING(5),
    },
    friStart: {
      type: DataTypes.STRING(5),
    },
    friEnd: {
      type: DataTypes.STRING(5),
    },
    satStart: {
      type: DataTypes.STRING(5),
    },
    satEnd: {
      type: DataTypes.STRING(5),
    },
    sunStart: {
      type: DataTypes.STRING(5),
    },
    sunEnd: {
      type: DataTypes.STRING(5),
    },
    VenueId: {
      type: DataTypes.UUID,
      unique: true,
    },
  },
  {
    tableName: "opening_hours",
    sequelize: sequelize,
    indexes: [
      {
        unique: true,
        fields: ["VenueId"], // Enforce unique constraint on VenueId
      },
    ],
  },
);

export { OpeningHour };
