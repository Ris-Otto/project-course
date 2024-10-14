import { DataTypes, Model } from "sequelize";
import sequelize from "../database.ts";

class Bio extends Model {
    declare id: number;
    declare description: string;

}

Bio.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        description: DataTypes.STRING,
    },
    {
        tableName: "events",
        sequelize: sequelize,
    }
)



export default Event;