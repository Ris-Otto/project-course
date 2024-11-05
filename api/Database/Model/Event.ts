import { DataTypes, Model } from "sequelize";
import sequelize from "../database.ts";
import Pricing from "./Pricing.ts";
import type { Artist } from "./Artist.ts";
import type { Venue } from "./Venue.ts";
import {Bio} from "./Bio.ts";

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
    declare Bio: Bio
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
                isIn: [[0, 1]]
            }
        },
        age: {
            type: DataTypes.INTEGER
        },
        start: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        tableName: "events",
        sequelize: sequelize,
    }
)



export default Event;