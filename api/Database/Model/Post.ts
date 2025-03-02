import sequelize from "../database.ts";
import { DataTypes, Model } from "npm:sequelize";
import type { Artist } from "./Artist.ts";
import type { Venue } from "./Venue.ts";
import type { Bio } from "./Bio.ts";

class Post extends Model {
  declare id: number;
  declare Artist?: Artist;
  declare text: string;
  declare name: string;
  declare Venue?: Venue;
  declare Bio: Bio;
  declare BioId: number;
  declare ArtistId: string;
  declare VenueId: string;
  declare published: boolean;
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
    name: {
      type: DataTypes.STRING,
    },
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "posts",
    sequelize: sequelize,
    indexes: [
      {
        unique: true,
        fields: ["id", "ArtistId", "BioId", "name"],
      },
      {
        unique: true,
        fields: ["id", "VenueId", "BioId", "name"],
      },
    ],
  },
);

export { Post };
