import { DataTypes, Model } from "sequelize";
import sequelize from "../database.ts";

class Pricing extends Model {
    declare id: number;
    declare currency: string;
    declare type: string;
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
            validate: {
                isCurrency: true,
                msg: "Invalid currency"
            }
        },
        type: {
            type: DataTypes.STRING,
            comment: "0: Cash, 1: Wallet, 2: Card",
            validate: {
                isIn: [[0,1,2]],
                msg: "Invalid pricing type"
            }
        },
        amount: {
            type: DataTypes.FLOAT,
            validate: {
                isFloat: true,
            }
        }
    },
    {
        tableName: "pricing",
        sequelize: sequelize,
    }
)

export default Pricing;