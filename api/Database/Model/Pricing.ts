import { DataTypes, Model } from "sequelize";
import sequelize from "../database.ts";

class Pricing extends Model {
    declare id: number;
    declare currency: string;
    declare type: number;
    declare amount: number;
    declare createdAt: Date;
    declare updatedAt: Date;
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
            allowNull: false,
        },
        type: {
            type: DataTypes.TINYINT,
            comment: "0: Cash, 1: Wallet, 2: Card",
            allowNull: false,

        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        }
    },
    {
        tableName: "pricing",
        sequelize: sequelize,
    }
)

export default Pricing;