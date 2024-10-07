import { DataTypes, Model } from "sequelize";
import sequelize from "../database.ts";
import Event from "./Event.ts"
import User from "./User.ts";

class EventUserMapping extends Model {}

EventUserMapping.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }
    },
    {
        tableName: "event_user_mapping",
        sequelize: sequelize,
    }
)

EventUserMapping.hasOne(User);
EventUserMapping.hasOne(Event);
export default EventUserMapping;