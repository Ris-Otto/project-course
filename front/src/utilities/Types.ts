import { Artist } from "../../../api/Database/Model/Artist.ts";
import Pricing from "../../../api/Database/Model/Pricing.ts";
import { Venue } from "../../../api/Database/Model/Venue.ts";
import { Result } from "../../../Shared/Result.ts";

export declare type Event = {
  id: number;
  name: string;
  Venue: Venue;
  Artists: Artist[];
  pricing: Pricing;
};

export type SuspenseConsumer<T> = {
  read(): Result<T>;
};
