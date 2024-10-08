import { BelongsToManyGetAssociationsMixin, DataTypes, Model } from "sequelize";
import sequelize from "../database.ts";
import User from "./User.ts";

class Event extends Model {
    declare id: number;
    declare name: string;
    declare users: User[];
    declare getUsers: BelongsToManyGetAssociationsMixin<User>;
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