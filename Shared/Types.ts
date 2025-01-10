import { User } from "../api/Database/Model/User.ts";
import { Venue } from "../api/Database/Model/Venue.ts";
import { Artist } from "../api/Database/Model/Artist.ts";

export type UserType = User | Venue | Artist;

export type UserPayload = {
  id: string;
  name: string;
  email: string;
  type: number;
  exp: number;
};

export function ResolveUserType(user: UserType) {
  if (user instanceof User) {
    return 0;
  } else if (user instanceof Artist) {
    return 1;
  }
  return 2;
}

export declare type FanProfile = {
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  Artists: Artist[];
  Venues: Venue[];
};
