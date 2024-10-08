import { DataTypes, Model } from "sequelize";

import sequelize from "../database.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import Event from "./Event.ts";

//Model is a base-class in the ORM
class User extends Model {
    declare name: string;
    declare email: string;
    declare id: number;
    declare password: string;
    declare active: 0 | 1;
    declare authenticate: (enteredPassword: string) => Promise<boolean>;
}

class Artist extends User {
    declare verified: 0 | 1;
    declare members: Member[];
    declare events: Event[];
}

class Member extends Model {
    declare id: number;
    declare name: string;
    declare role: string;
    declare artists: Artist[];
}

class Venue extends Model {
    declare verified: 0 | 1;
    declare events: Event[]
    declare address: string;
    declare zip: string;
    declare city: string;
    declare country: string;
    declare businessId: string;
    declare name: string;
    declare businessEmail: string;
    declare contactEmail: string;
    declare contactName: string;
    declare id: number;
    declare password: string;
    declare authenticate: (enteredPassword: string) => Promise<boolean>;
}

class ArtistMembersMapping extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
        },
        password: {
          type: DataTypes.STRING(256),

        },
        active: {
            type: DataTypes.BOOLEAN,
            comment: "0 if user has not verified email, 1 otherwise"
        }
    },
    {
        tableName: "users",
        sequelize: sequelize,
    }
)

Artist.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING(256),

        },
        active: {
            type: DataTypes.BOOLEAN,
            comment: "0 if user has not verified email, 1 otherwise"
        },
        genre: {
            type: DataTypes.STRING,
        },
        verified: DataTypes.TINYINT,
    },
    {
        tableName: "artists",
        sequelize: sequelize,
    }
)

Venue.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        businessEmail: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING(256),

        },
        address: {
            type: DataTypes.STRING,
        },
        zip: DataTypes.STRING,
        city: DataTypes.STRING,
        country: DataTypes.STRING,
        businessId: {
            type: DataTypes.STRING,
        },
        verified: DataTypes.TINYINT,
        contactEmail: DataTypes.STRING,
        contactName: DataTypes.STRING,
    },
    {
        tableName: "venues",
        sequelize: sequelize,
    }
)

Member.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        role: DataTypes.STRING,
    },
    {
        tableName: "members",
        sequelize: sequelize,
    }
)



ArtistMembersMapping.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    },
    {
        tableName: "artist_member_mapping",
        sequelize: sequelize,
    }
)

User.prototype.authenticate = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(this.password, enteredPassword);
}

Artist.prototype.authenticate = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(this.password, enteredPassword);
}

Venue.prototype.authenticate = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(this.password, enteredPassword);
}

User.addHook("beforeCreate",
    async (user: User) => {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
    }
)


export {User, Artist, Venue, Member, ArtistMembersMapping};