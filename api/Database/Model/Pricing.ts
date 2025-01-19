import { DataTypes, Model } from "npm:sequelize";
import sequelize from "../database.ts";

class Pricing extends Model {
  declare id: number;
  declare currency: string;
  declare type: number;
  declare amount: number;
}

type PricingRead = {
  id: number;
  currency: string;
  type: number;
  amount: number;
};

Pricing.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.TINYINT,
      comment:
        "1: Cash, 2: Wallet, 3: Cash & Wallet, 4: Card, 5: Cash & Card, 6: Wallet & Card, 7: All",
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "pricing",
    sequelize: sequelize,
  },
);

export default Pricing;
export type { PricingRead };
