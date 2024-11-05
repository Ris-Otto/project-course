import { User } from "./Database/Model/User.ts";
import sequelize from "./Database/database.ts";
import {ArtistFollowing} from "./Database/Model/Following.ts";
import Event from "./Database/Model/Event.ts";
import Pricing from "./Database/Model/Pricing.ts";
import EventMapping from "./Database/Model/EventMapping.ts";
import type { ModelStatic, Model } from "sequelize";
import { ArtistMembersMapping, Artist } from "./Database/Model/Artist.ts";
import { Member } from "./Database/Model/Member.ts";
import { Venue } from "./Database/Model/Venue.ts";
import {Role} from "./Database/Model/Role.ts";


export async function setupTestData() {
    const hefeUser = await User.create({
        name: "finland hefe",
        email: "finland@hefe.fi",
        password: "hefe-pw123",
        verified: true,
    });
    const artistWithMems = await Artist.create({
        name: "Hefe band",
        email: "hefe@finland.fi",
        password: "superturboman",
        verified: true,
        genre: "Death-grindcore-alt-neosoul-funk"
    });
    const mems = await Promise.all([
        await Member.create({
            name: "Hubert",
        }),
        await Member.create({
            name: "Hjalmar",
        }),
        await Member.create({
            name: "Heston",
        }),
    ])
    const amm: ArtistMembersMapping[] = [];
    for (const mem of mems) {
        amm.push(await ArtistMembersMapping.create({
            MemberId: mem.id,
            ArtistId: artistWithMems.id
        }));
    }
    const roles = ["guitar", "bass", "drums", "provisions"]
    for (let i = 0; i < amm.length; i++){
        const a = amm[i];
        await Role.create({
            description: roles[i],
            MemberId: a.MemberId,
            ArtistId: a.ArtistId,
        })
    }

    await ArtistFollowing.create({
        UserId: hefeUser.id,
        ArtistId: artistWithMems.id,
    });

    const loserBand = await Artist.create({
        name: "loserband",
        email: "loser@finland.fi",
        password: "rentboy",
        verified: true,
        genre: "Grunkcore-purplegrass"
    });

    const supermanVenue = await Venue.create({
        name: "Venue hefe",
        email: "venue@finland.fi",
        password: "batman",
        verified: true,
        address: "Superman batcave 42 A",
        zip: "20500",
        city: "Turku",
        country: "FI",
        businessId: "12345678-9"
    });

    const pricingCash = await Pricing.create({
        currency: "EUR",
        type: 0,
        amount: 10.0
    });

    const pricingCard = await Pricing.create({
        currency: "EUR",
        type: 2,
        amount: 7.99
    });

    const pricingWallet = await Pricing.create({
        currency: "EUR",
        type: 1,
        amount: 40.0
    });
    const events = await Promise.all([
        Event.create({
            name: "Event 1",
            cancelled: 0,
            PricingId: pricingCash.id,
            VenueId: supermanVenue.id,
            start: new Date(),
            end: new Date()
        }),
        Event.create({
            name: "Event 2",
            cancelled: 0,
            PricingId: pricingCard.id,
            VenueId: supermanVenue.id,
            start: new Date(),
            end: new Date()
        }),
        Event.create({
            name: "Event 3",
            cancelled: 1,
            PricingId: pricingWallet.id,
            VenueId: supermanVenue.id,
            start: new Date(),
            end: new Date()
        })
    ]);

    for (const event of events) {
        await EventMapping.create({
            EventId: event.id,
            ArtistId: artistWithMems.id
        })
        await EventMapping.create({
            EventId: event.id,
            ArtistId: loserBand.id
        })
    }
}

export async function forceSyncDatabaseAndSetupTestData() {
    await sequelize.sync({ force: true });
    await setupTestData();
}

export async function alterSyncDatabase() {
    await sequelize.sync({ alter: true });
}

export function defaultGetModel<T extends Model<any, any>, TNext extends Model<any, any>>(model:  ModelStatic<T>, include?: ModelStatic<TNext>): any {
    return include ?
        {
            model: model,
            attributes: { exclude: [ "password"]},
            through: {
                attributes: []
            },
            include: [defaultGetModel(include)]
        } :
        {
            model: model,
            attributes: { exclude:["password"]},
            through: {
                attributes: []
            }
        }
}

/**
 * `excludeMapping` can only be true if the association between the parent model and the included model
 * has a separate mapping table in the database, otherwise the request will throw
 */
export type Includeable<T extends Model> = {
    model: ModelStatic<T>;
    exclude?: string[];
    include?: Includeable<Model>[]
    excludeMapping?: boolean
}

export type Included<T extends Model> = {
    model: ModelStatic<T>,
    attributes?: { exclude: string[] },
    through?: { attributes: never[] }
    include?: any[]
}

export function includeModel<T extends Model>(includeable: Includeable<T>): Included<T> {
    const { model, exclude, include, excludeMapping} = includeable;

    const subModels: Includeable<Model<any,any>>[] = [];

    const ret: Included<T> = {
        model: model,
    };
    if(exclude) {
        ret.attributes = {
            exclude: exclude as unknown as string[]
        };
    }
    if(excludeMapping) {
        ret.through =  {
            attributes: []
        };
    }
    if(include) {
        include.forEach(a => {subModels.push((includeModel(a)));});
        ret.include = subModels;
    }
    return ret;
}

export function includeArtist() {
    return includeModel(
        {
            model: Artist,
            excludeMapping: true,
            exclude: ["password", "createdAt", "updatedAt"],
            include: [{
                model: Member,
                excludeMapping: true,
                exclude: ["createdAt", "updatedAt"],
                include: [{
                    model: Role,
                    exclude: ["createdAt", "updatedAt"],
                }]
            }]
        }
    )
}