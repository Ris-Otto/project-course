import { Artist, Role } from "./Model/Artist.ts";
import { Member } from "./Model/Member.ts";
import type { Model, ModelStatic } from "npm:sequelize";
import Event from "./Model/Event.ts";
import { Venue } from "./Model/Venue.ts";
import Pricing from "./Model/Pricing.ts";
import { Bio } from "./Model/Bio.ts";
import { Media } from "./Model/Media.ts";
import { OpeningHour } from "./Model/OpeningHour.ts";
import { Link } from "./Model/Link.ts";

/**
 * `excludeMapping` can only be true if the association between the parent model and the included model
 * has a separate mapping table in the database, otherwise the request will throw
 */
export type Includeable<T extends Model> = {
  model: ModelStatic<T>;
  exclude?: string[];
  include?: Includeable<Model>[] | Includeable<Model>;
  excludeMapping?: boolean;
};
export type Included<T extends Model> = {
  model: ModelStatic<T>;
  attributes?: { exclude: string[] };
  through?: { attributes: never[] };
  include?: any[];
};

export function includeModel<T extends Model>(
  includeable: Includeable<T>,
): Included<T> {
  const { model, exclude, include, excludeMapping } = includeable;

  const ret: Included<T> = {
    model: model,
  };
  if (exclude) {
    ret.attributes = {
      exclude: exclude as unknown as string[],
    };
  }
  if (excludeMapping) {
    ret.through = {
      attributes: [],
    };
  }
  if (include) {
    if (Array.isArray(include)) {
      const subModels: Includeable<Model<any, any>>[] = [];
      include.forEach((a) => {
        subModels.push(includeModel(a));
      });
      ret.include = subModels;
    } else {
      ret.include = [include];
    }
  }
  return ret;
}

export function includeArtist() {
  return includeModel({
    model: Artist,
    excludeMapping: true,
    exclude: ["password", "createdAt", "updatedAt"],
    include: [includeMember(), includeBio()],
  });
}

export function includeVenue() {}

export function includeMember() {
  return includeModel({
    model: Member,
    excludeMapping: true,
    exclude: ["createdAt", "updatedAt"],
  });
}

export function includeEvent() {
  return includeModel({
    model: Event,
    exclude: ["createdAt", "updatedAt"],
    include: [
      {
        model: Venue,
        exclude: ["password", "createdAt", "updatedAt"],
      },
      {
        model: Pricing,
        exclude: ["createdAt", "updatedAt"],
      },
      includeBio(),
      {
        model: Artist,
        exclude: ["password", "createdAt", "updatedAt"],
      },
    ],
  });
}

export function includeBio() {
  return includeModel({
    model: Bio,
    exclude: ["createdAt", "updatedAt"],
    include: [{
      model: Media,
      exclude: ["createdAt", "updatedAt"],
      //TODO actually fetch images as well
      //Likely can't be done with sequelize
      //Or at least internal media
      //Could store all 'internal' media on a file server and then fetch client-side
    }, { model: Link, exclude: ["createdAt", "updatedAt"] }],
  });
}

export function includeOpeningHours() {
  return includeModel({
    model: OpeningHour,
    exclude: ["createdAt", "updatedAt"],
  });
}
