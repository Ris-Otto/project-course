import sequelize from "../database.ts";
import { DataTypes, Model } from "npm:sequelize";
import type { Artist } from "./Artist.ts";
import type { Media } from "./Media.ts";
import type { Venue } from "./Venue.ts";

class Post extends Model {
  declare id: number;
  declare Artist?: Artist;
  declare text: string;
  declare Media: Media[];
  declare Venue?: Venue;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "posts",
    sequelize: sequelize,
  },
);

export { Post };
