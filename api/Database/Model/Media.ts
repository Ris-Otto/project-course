import sequelize from "../database.ts";
import Sequelize, { DataTypes, Model } from "sequelize";


class Media extends Model {
    declare media_id: string;
    declare internal: boolean;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare href: string;
}

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
        }
    },
    {
        tableName: "media",
        sequelize: sequelize
    }
)

export { Media }