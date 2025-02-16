import { DataTypes, Model } from "npm:sequelize";
import Sequelize from "npm:sequelize";
import sequelize from "../database.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { ArtistFollowing, VenueFollowing } from "./Following.ts";
import { Venue } from "./Venue.ts";
import { Artist } from "./Artist.ts";

class User extends Model {
  declare name: string;
  declare email: string;
  declare id: string;
  declare password: string;
  declare verified: 0 | 1;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare authenticate: (enteredPassword: string) => Promise<boolean>;
  declare addVenue: (venueId: string) => Promise<VenueFollowing | null>;
  declare addArtist: (artistId: string) => Promise<Artist | null>;
  declare removeArtist: (artistId: string) => Promise<Artist | null>;
  declare removeVenue: (venueId: string) => Promise<Venue | null>;
  declare getVenues: () => Promise<Venue[]>;
  declare getArtists: () => Promise<Artist[]>;
}

User.init(
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
    },
    verified: {
      type: DataTypes.BOOLEAN,
      comment: "0 if user has not verified email, 1 otherwise",
    },
  },
  {
    tableName: "users",
    sequelize: sequelize,
  },
);

User.prototype.authenticate = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.addHook("beforeCreate", async (user: User) => {
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);
});

export { User };
