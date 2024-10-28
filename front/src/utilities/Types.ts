import {Artist, Venue} from "../../../api/Database/Model/User.ts";
import Pricing from "../../../api/Database/Model/Pricing.ts";


export declare type Event = {
    id: number;
    name: string;
    Venue: Venue;
    Artists: Artist[];
    pricing: Pricing;
}