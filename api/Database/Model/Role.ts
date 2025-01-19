import sequelize from "../database.ts";
import { DataTypes, Model } from "npm:sequelize";

class Role extends Model {
  declare id: number;
  declare description: string;
  declare MemberId: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare ArtistId: string;
}

type RoleRead = {
  id: number;
  description: string;
  MemberId: number;
  ArtistId: string;
};

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "roles",
    sequelize: sequelize,
  },
);

export { Role };
export type { RoleRead };
