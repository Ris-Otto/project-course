import { DataTypes, Model } from "sequelize";
import sequelize from "../database.ts";

export class Link extends Model {
  declare id: number; // Unique internal identifier
  declare url: string; // Link URL

  // Timestamps
  declare createdAt: Date;
  declare updatedAt: Date;
}

// Initialize the Link model

Link.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED, // Unsigned integer
      primaryKey: true, // Primary key
      autoIncrement: true, // Auto-increment
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING, // Store URL as a string
      allowNull: false, // URL cannot be null
      validate: {
        isUrl: true, // Validate that the string is a URL
      },
    },
  },
  {
    sequelize: sequelize,
    tableName: "links", // Specify table name explicitly
  },
);
