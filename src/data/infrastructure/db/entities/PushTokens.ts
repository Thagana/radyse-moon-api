import { Model, DataTypes, Optional } from "sequelize";
import { Database } from "../index";
import config from '../../../../configs/db.configs';

interface PushTokenAttributes {
    id: string;
    user_id: string;
    title: string;
    token: string;
}

type PushTokenCreationAttributes = Optional<PushTokenAttributes, 'id'>;

class PushToken extends Model<PushTokenAttributes, PushTokenCreationAttributes> implements PushTokenAttributes {
    public id!: string;
    public user_id!: string;
    public title!: string;
    public token!: string;
}

PushToken.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: "push_tokens",
    sequelize: new Database(config.DATABASE_URI).sequelize!,
    timestamps: false,
})