import { createStore, atom, useAtom, useSetAtom } from "jotai";
import {Event} from "./utilities/Types.ts";
import type { UserPayload } from "../../Shared/Types.ts";

const store = createStore();

const email = atom("");
const password = atom("");

const events = atom<Event[]>([])

const user = atom<UserPayload | null>(null);

store.set(email, "");
store.set(password, "");
store.set(events, []);
store.set(user, null);


export { store, email, password, events, user };