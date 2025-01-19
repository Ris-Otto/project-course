import { DataTypes, Model } from "npm:sequelize";
import sequelize from "../database.ts";

import Event from "./Event.ts";
import type { Artist } from "./Artist.ts";

class EventMapping extends Model {
  declare id: number;
  declare Artist: Artist;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare Event: Event;
}

EventMapping.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: "event_mapping",
    sequelize: sequelize,
  },
);

export default EventMapping;
