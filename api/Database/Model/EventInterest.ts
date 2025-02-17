import sequelize from "../database.ts";
import { DataTypes, Model } from "npm:sequelize";
import Sequelize from "npm:sequelize";

class EventInterest extends Model {
  declare id: number;
  declare EventId: string;
  declare UserId: string;
  //Not interested, Interested, Going
  declare interest: 0 | 1 | 2;
}

EventInterest.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    interest: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: "event_interest",
    sequelize: sequelize,
    indexes: [
      {
        unique: true,
        fields: ["EventId", "UserId"],
      },
    ],
  },
);

export { EventInterest };
