import { DataTypes, Model } from "sequelize";
import sequelize from "../database.ts";
import type { Media } from "./Media.ts";

class Bio extends Model {
    declare id: number;
    declare description: string;
    declare Media: Media[];
    declare createdAt: Date;
    declare updatedAt: Date;
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
        tableName: "bios",
        sequelize: sequelize,
    }
)

export { Bio };