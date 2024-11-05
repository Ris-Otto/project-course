import sequelize from "../database.ts";
import { DataTypes, Model } from "sequelize";


class Role extends Model {
    declare id: number;
    declare description: string;
    declare MemberId: number;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare ArtistId: string;
}


Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: "roles",
        sequelize: sequelize,
    }
)

export { Role }