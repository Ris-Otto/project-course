import { DataTypes, Model } from "sequelize";
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
    declare reviewer_type: number;
}


Review.init(
    {
        review_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [0, 255],
                isAlphanumeric: true
            }
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                max: 10,
                min: 0
            }
        },
        reviewer_type: {
            type: DataTypes.TINYINT,
            allowNull: false,
            validate: {
                max: 1,
                min: 0,
            }
        }
    },
    {
        tableName: "reviews",
        sequelize: sequelize,
    }
)