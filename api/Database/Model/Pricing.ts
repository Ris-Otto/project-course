import { DataTypes, Model } from "sequelize";
import sequelize from "../database.ts";

class Pricing extends Model {
    declare id: number;
    declare currency: string;
    declare type: number;
    declare amount: number;
}

Pricing.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        currency: {
            type: DataTypes.STRING,

        },
        type: {
            type: DataTypes.TINYINT,
            comment: "0: Cash, 1: Wallet, 2: Card",

        },
        amount: {
            type: DataTypes.FLOAT,
        }
    },
    {
        tableName: "pricing",
        sequelize: sequelize,
    }
)

export default Pricing;