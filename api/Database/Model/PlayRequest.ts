import sequelize from "../database.ts";
import { DataTypes, Model } from "npm:sequelize";
import { Artist } from "./Artist.ts";
import { Venue } from "./Venue.ts";

class PlayRequest extends Model {
  declare id: number;
  declare ArtistId: string;
  declare EventId: number;
  declare VenueId: string;
  declare acknowledged: boolean;
  declare accepted: boolean;
  declare getArtist: () => Promise<Artist>;
  declare getVenue: () => Promise<Venue>;
  declare getEvent: () => Promise<Event>;
}

PlayRequest.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    acknowledged: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: sequelize,
    tableName: "play_requests",
  },
);

export { PlayRequest };
