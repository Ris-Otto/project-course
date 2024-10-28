import {Artist, ArtistMembersMapping, Member, User, Venue} from "./Database/Model/User.ts";
import sequelize from "./Database/database.ts";
import {ArtistFollowing} from "./Database/Model/Following.ts";
import Event from "./Database/Model/Event.ts";
import Pricing from "./Database/Model/Pricing.ts";
import EventMapping from "./Database/Model/EventMapping.ts";
import type { ModelStatic, Model } from "sequelize";


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
            role: "Guitar"
        }),
        await Member.create({
            name: "Hjalmar",
            role: "Bass"
        }),
        await Member.create({
            name: "Heston",
            role: "Drumz"
        }),
    ])
    mems.forEach(mem => ArtistMembersMapping.create({
        MemberId: mem.id,
        ArtistId: artistWithMems.id
    }));
    await ArtistFollowing.create({
        UserId: hefeUser.id,
        ArtistId: artistWithMems.id,
    })
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
    })
    const pricingCard = await Pricing.create({
        currency: "EUR",
        type: 2,
        amount: 7.99
    })
    const pricingWallet = await Pricing.create({
        currency: "EUR",
        type: 1,
        amount: 40.0
    })
    const events = await Promise.all([
        Event.create({
            name: "Event 1",
            cancelled: 0,
            PricingId: pricingCash.id,
            VenueId: supermanVenue.id
        }),
        Event.create({
            name: "Event 2",
            cancelled: 0,
            PricingId: pricingCard.id,
            VenueId: supermanVenue.id
        }),
        Event.create({
            name: "Event 3",
            cancelled: 1,
            PricingId: pricingWallet.id,
            VenueId: supermanVenue.id
        })
    ])
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