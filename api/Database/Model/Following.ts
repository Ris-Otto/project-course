import { DataTypes, Model } from "sequelize";
import sequelize from "../database.ts";

class ArtistFollowing extends Model {
    declare id: number;
    declare description: string;
    declare UserId: number;
    declare ArtistId: number;

}

ArtistFollowing.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }
    },
    {
        tableName: "artist_following",
        sequelize: sequelize,
    }
)

class VenueFollowing extends Model {
    declare id: number;
    declare description: string;

}

VenueFollowing.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }
    },
    {
        tableName: "venue_following",
        sequelize: sequelize,
    }
)

export {ArtistFollowing, VenueFollowing};