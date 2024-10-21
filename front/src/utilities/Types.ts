import {Artist, Venue} from "../../../api/Database/Model/User.ts";
import Pricing from "../../../api/Database/Model/Pricing.ts";


export declare type Event = {
    name: string;
    venue: Venue;
    artists: Artist[];
    pricing: Pricing;
}