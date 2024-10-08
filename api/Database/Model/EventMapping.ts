import { DataTypes, Model } from "sequelize";
import sequelize from "../database.ts";
import {Artist} from "./User.ts";
import Event from "./Event.ts";

class EventMapping extends Model {
    declare id: number;
    declare artist: Artist;
    declare event: Event
}

EventMapping.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }
    },
    {
        tableName: "event_mapping",
        sequelize: sequelize,
    }
)

export default EventMapping;