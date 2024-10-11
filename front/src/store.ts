import { createStore, atom, useAtom, useSetAtom } from "jotai";
import {Event} from "./utilities/Types.ts";

const store = createStore();

const email = atom("");
const password = atom("");

const events = atom<Event[]>([])

store.set(email, "");
store.set(password, "");
store.set(events, []);

export { store, email, password, events };