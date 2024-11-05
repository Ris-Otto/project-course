
import sequelize from "../database.ts";
import { DataTypes, Model } from "sequelize";
import type { Artist } from "./Artist.ts";
import type { Role } from "./Role.ts";

class Member extends Model {
    declare id: number;
    declare name: string;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare Roles: Role[];
    declare Artists: Artist[];
}


Member.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING
    },
    {
        tableName: "members",
        sequelize: sequelize,
    }
)

export { Member }