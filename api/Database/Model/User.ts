import { BelongsToManyGetAssociationsMixin, DataTypes, Model } from "npm:sequelize";
import Event from "./Event.ts"
import sequelize from "../database.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

class User extends Model {
    declare name: string;
    declare email: string;
    declare type: number;
    declare id: number;
    declare password: string;
    declare events?: Event[];
    declare authenticate: (enteredPassword: string) => Promise<boolean>;
    declare getEvents: BelongsToManyGetAssociationsMixin<Event>;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
        },
        password: {
          type: DataTypes.STRING(256),

        },
        type: {
            type: DataTypes.TINYINT,
            comment: "0: User, 1: Band/Artist, 2: Venue, 3: Admin",
        }
    },
    {
        tableName: "users",
        sequelize: sequelize,
    }
)

User.prototype.authenticate = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(this.password, enteredPassword);
}

User.addHook("beforeCreate",
    async (user: User) => {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
    }
)


export default User;