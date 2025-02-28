import { DataTypes, Model } from "npm:sequelize";
import sequelize from "../database.ts";

class Review extends Model {
  declare review_id: number;
  declare VenueId: string;
  declare ArtistId: string;
  declare EventId: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare description: string;
  declare score: number;
  declare reviewer_type: 1 | 0;
}

Review.init(
  {
    review_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {},
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 10,
        min: 0,
      },
    },
    reviewer_type: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  },
  {
    tableName: "reviews",
    sequelize: sequelize,
    indexes: [{
      fields: ["EventId", "VenueId", "ArtistId", "reviewer_type"],
      unique: true,
    }],
  },
);

export { Review };
