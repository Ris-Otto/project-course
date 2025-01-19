import { atom, createStore, type PrimitiveAtom, useAtom } from "jotai";
import type { UserPayload } from "../../Shared/Types.ts";
import Event from "../../api/Database/Model/Event.ts";
// @deno-types="npm:@types/react"
import { useCallback } from "react";
import { ArtistFollowing } from "../../api/Database/Model/Following.ts";
import Pricing from "../../api/Database/Model/Pricing.ts";

declare interface UserRegister {
  email: string;
  password: string;
  name: string;
  [index: string]: number | string;
}

declare interface VenueRegister {
  email: string;
  password: string;
  name: string;
  businessId: string;
  address: string;
  zip: string;
  city: string;
  [index: string]: number | string;
}

declare interface ArtistRegister {
  email: string;
  password: string;
  name: string;
  [index: string]: number | string;
}

const initialUser: UserRegister = {
  email: "",
  password: "",
  name: "",
};

const initialArtist: ArtistRegister = {
  email: "",
  password: "",
  name: "",
};
const initialVenue: VenueRegister = {
  email: "",
  password: "",
  name: "",
  businessId: "",
  address: "",
  zip: "",
  city: "",
};

const store = createStore();

export function DefaultReducer<Value extends Record<string, string | number>>(
  prev: Value,
  action?: DefaultAction<Value>,
): Value {
  if (!action) return prev;
  if (action.type === "all") {
    const keys = Object.keys(prev);
    const copy = Object.create(prev);
    for (const key of keys) {
      copy[key] = action.payload;
    }
    return copy;
  }
  return {
    ...prev,
    [action.type]: action.payload,
  };
}

export function useReducerAtom<Value>(
  anAtom: PrimitiveAtom<Value>,
  reducer: AtomReducer<Value>,
) {
  const [state, setState] = useAtom(anAtom);
  const dispatch = useCallback(
    (action: DefaultAction<Value>) => setState((prev) => reducer(prev, action)),
    [setState, reducer],
  );
  return [state, dispatch] as const;
}

export type AtomReducer<Value> = (v: Value, a: DefaultAction<Value>) => Value;

export type DefaultAction<T> = { payload: string; type: keyof T | "all" };

const userRegisterAtom = atom(initialUser);
const venueRegisterAtom = atom(initialVenue);
const artistRegisterAtom = atom(initialArtist);

const events = atom<Event[]>([]);

const user = atom<UserPayload | null>(null);

const pricingAtom = atom<Pricing | null>(null);

const userFollowing = atom<ArtistFollowing[] | null>(null);

store.set(events, []);
store.set(user, null);

const open = atom(false);

export {
  artistRegisterAtom,
  events,
  store,
  user,
  userFollowing,
  userRegisterAtom,
  venueRegisterAtom,
  pricingAtom,
  open,
};
