import { DataTypes, Model } from "npm:sequelize";
import sequelize from "../database.ts";
import type { Media, MediaRead } from "./Media.ts";
import { Link } from "./Link.ts";

class Bio extends Model {
  declare id: number;
  declare description: string;
  declare Media: Media[];
  declare Links: Link[];
  declare createdAt: Date;
  declare updatedAt: Date;
  declare getMedia: () => Promise<Media[]>;
  declare getLinks: () => Promise<Link[]>;
}

type BioRead = {
  id: number;
  description: string;
  Media: MediaRead[];
};

Bio.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: DataTypes.TEXT,
  },
  {
    tableName: "bios",
    sequelize: sequelize,
  },
);

export { Bio };
export type { BioRead };
