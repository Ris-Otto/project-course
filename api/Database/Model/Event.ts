import { DataTypes, Model } from "sequelize";
import sequelize from "../database.ts";
import {Artist, Venue} from "./User.ts";
import Pricing from "./Pricing.ts";

class Event extends Model {
    declare id: number;
    declare name: string;
    declare venue: Venue;
    declare artists: Artist[];
    declare pricing: Pricing;
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
        }
    },
    {
        tableName: "events",
        sequelize: sequelize,
    }
)



export default Event;