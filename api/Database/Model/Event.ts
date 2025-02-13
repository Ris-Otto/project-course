import { DataTypes, Model } from "npm:sequelize";
import sequelize from "../database.ts";
import Pricing from "./Pricing.ts";
import type { Artist } from "./Artist.ts";
import type { Venue } from "./Venue.ts";
import { Bio } from "./Bio.ts";
import EventMapping from "./EventMapping.ts";

type EventRead = {
  id: number;
  name: string;
  age: number;
  start: Date;
  end: Date;
};

class Event extends Model {
  declare id: number;
  declare name: string;
  declare Venue: Venue;
  declare Artists: Artist[];
  declare Pricing: Pricing;
  declare PricingId: number;
  declare VenueId: string;
  declare age: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare start: Date;
  declare end: Date;
  declare Bio: Bio;
  declare BioId: number;
  declare published: boolean;
  declare cancelled: boolean;
  declare address: string;
  declare zip: string;
  declare city: string;
  declare getArtists: () => Promise<Artist[]>;
  declare getVenue: () => Promise<Venue>;
  declare getBio: () => Promise<Bio>;
  declare getPricing: () => Promise<Pricing>;
  declare getEventMapping: () => Promise<EventMapping>;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    cancelled: {
      type: DataTypes.TINYINT,
      validate: {
        isIn: [[0, 1]],
      },
    },
    age: {
      type: DataTypes.INTEGER,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
    },
    zip: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "events",
    sequelize: sequelize,
  },
);

export default Event;
export type { EventRead };
