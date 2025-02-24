import sequelize from "../database.ts";
import Sequelize, { DataTypes, Model } from "npm:sequelize";

class Media extends Model {
  declare media_id: string;
  declare internal: boolean;
  declare poster: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare href: string;
}

type MediaRead = {
  media_id: string;
  internal: boolean;
  href: string;
};

Media.init(
  {
    media_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    internal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    href: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    poster: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "media",
    sequelize: sequelize,
    indexes: [
      {
        unique: true,
        name: "poster_index",
        fields: ["BioId", "poster", "href"],
      },
      {
        unique: true,
        fields: ["BioId", "media_id"],
      },
    ],
  },
);

export { Media };
export type { MediaRead };
