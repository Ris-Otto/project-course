import sequelize from "../database.ts";
import { DataTypes, Model } from "npm:sequelize";
import type { Artist, Role } from "./Artist.ts";

class Member extends Model {
  declare id: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare Roles: Role[];
  declare Role: Role;
  declare Artists: Artist[];
}

Member.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
  },
  {
    tableName: "members",
    sequelize: sequelize,
    indexes: [
      {
        unique: true,
        fields: ["name", "id"],
      },
    ],
  },
);

export { Member };
