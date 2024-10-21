import { DataTypes, Model } from "sequelize";
import sequelize from "../database.ts";

class Bio extends Model {
    declare id: number;
    declare description: string;
}

Bio.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        description: DataTypes.STRING,
    },
    {
        tableName: "bios",
        sequelize: sequelize,
    }
)

class ArtistBio extends Model {
    declare id: number;
}

ArtistBio.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        description: DataTypes.STRING,
    },
    {
        tableName: "artist_bios",
        sequelize: sequelize,
    }
)

class VenueBio extends Model {
    declare id: number;
}

VenueBio.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        description: DataTypes.STRING,
    },
    {
        tableName: "venue_bios",
        sequelize: sequelize,
    }
)



export { Bio, VenueBio, ArtistBio};