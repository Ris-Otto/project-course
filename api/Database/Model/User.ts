import { BelongsToManyGetAssociationsMixin, DataTypes, Model } from "npm:sequelize";
import Event from "./Event.ts"
import sequelize from "../database.ts";
import bcrypt from "npm:bcrypt";

class User extends Model {
    declare name: string;
    declare email: string;
    declare type: number;
    declare id: number;
    declare password: string;
    declare events?: Event[];
    declare authenticate: (enteredPassword: string) => boolean;
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

User.prototype.authenticate = function (enteredPassword: string): boolean {
    return bcrypt.compare(this.password, enteredPassword);
}

User.addHook("beforeCreate",
    (user: User) => (user.password = bcrypt.hashSync(user.password, 12))
)


export default User;