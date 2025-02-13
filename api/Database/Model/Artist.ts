import Event, { type EventRead } from "./Event.ts";
import sequelize from "../database.ts";
import { DataTypes, Model } from "npm:sequelize";
import Sequelize from "npm:sequelize";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import type { Member, MemberRead } from "./Member.ts";
import type { Bio, BioRead } from "./Bio.ts";

class Artist extends Model {
  declare name: string;
  declare email: string;
  declare id: string;
  declare password: string;
  declare genre: string;
  declare authenticate: (enteredPassword: string) => Promise<boolean>;
  declare verified: 0 | 1;
  declare Members: Member[];
  declare Events: Event[];
  declare Bio: Bio;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare addEvent: (eventId: string) => Promise<Event | null>;
  declare addBio: (bioId: number) => Promise<Bio | null>;
  declare addMember: (memberId: number) => Promise<Member | null>;
  declare removeMember: (memberId: number) => Promise<Member | null>;
  declare getEvents: () => Promise<Event[]>;
  declare getMembers: () => Promise<Member[]>;
  declare getBio: () => Promise<Bio>;
  declare removeEvent: (eventId: string) => Promise<Event | null>;
}

type ArtistRead = {
  name: string;
  email: string;
  id: string;
  genre: string;
  Members: MemberRead[];
  Bio: BioRead;
};

Artist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 0,
        max: 32,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "email",
        msg: "Email must be unique",
      },
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
    },
    verified: DataTypes.TINYINT,
  },
  {
    tableName: "artists",
    sequelize: sequelize,
  },
);

Artist.prototype.authenticate = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

Artist.addHook("beforeCreate", async (artist: Artist) => {
  const salt = await bcrypt.genSalt(12);
  artist.password = await bcrypt.hash(artist.password, salt);
});

class ArtistMembersMapping extends Model {
  declare id: number;
  declare MemberId: number;
  declare ArtistId: string;
}

ArtistMembersMapping.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    MemberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ArtistId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "artist_member_mapping",
    sequelize: sequelize,
  },
);

class NonArtist extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare genre: string;
}

NonArtist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 0,
        max: 32,
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    genre: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "non_artists",
    sequelize: sequelize,
  },
);

export { Artist, ArtistMembersMapping, NonArtist };
export type { ArtistRead };
