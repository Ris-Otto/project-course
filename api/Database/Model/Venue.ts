import Event from "./Event.ts";
import sequelize from "../database.ts";
import { DataTypes, FindOptions, Model } from "npm:sequelize";
import Sequelize from "npm:sequelize";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { Bio, type BioRead } from "./Bio.ts";
import type EventMapping from "./EventMapping.ts";
import { OpeningHour } from "./OpeningHour.ts";
import { getPoster } from "../../Controllers/Extensions/Extensions.ts";

class Venue extends Model {
  declare verified: 0 | 1;
  declare Events: Event[];
  declare address: string;
  declare zip: string;
  declare city: string;
  declare country: string;
  declare businessId: string;
  declare name: string;
  declare email: string;
  declare phone: string;
  declare contactEmail: string;
  declare contactName: string;
  declare id: string;
  declare password: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare Bio: Bio;
  declare BioId: number;
  declare OpeningHour: OpeningHour;
  declare authenticate: (enteredPassword: string) => Promise<boolean>;
  declare addEvent: (eventId: string) => Promise<EventMapping | null>;
  declare getEvents: () => Promise<Event[]>;
  declare addBio: (bioId: number) => Promise<Bio | null>;
  declare poster?: string;
}

type VenueRead = {
  address: string;
  zip: string;
  city: string;
  country: string;
  businessId: string;
  name: string;
  email: string;
  id: string;
  Bio: BioRead;
};

Venue.init(
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
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    verified: DataTypes.TINYINT,
  },
  {
    tableName: "venues",
    sequelize: sequelize,
  },
);

Venue.prototype.authenticate = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

Venue.addHook("beforeCreate", async (venue: Venue) => {
  const salt = await bcrypt.genSalt(12);
  venue.password = await bcrypt.hash(venue.password, salt);
});

Venue.afterFind(
  "poster",
  (venue: Venue | readonly Venue[] | null, _options: FindOptions<any>) => {
    if (!venue) return;
    if (venue instanceof Venue) {
      venue.poster = getPoster(venue);
      return;
    }
    for (const venue1 of venue) {
      venue1.poster = getPoster(venue1);
    }
  },
);

export { Venue };
export type { VenueRead };
