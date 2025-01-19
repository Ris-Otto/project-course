import sequelize from "../database.ts";
import { DataTypes, Model } from "npm:sequelize";
import type { Artist, ArtistRead } from "./Artist.ts";
import type { Role, RoleRead } from "./Role.ts";

class Member extends Model {
  declare id: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare Roles: Role[];
  declare Artists: Artist[];
}

type MemberRead = {
  id: number;
  name: string;
  Roles: RoleRead[];
};

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
  },
);

export { Member };
export type { MemberRead };
