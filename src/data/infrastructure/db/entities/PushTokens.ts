import { Model, DataTypes, Optional } from "sequelize";
import { Database } from "../index";
import config from '../../../../configs/db.configs';

interface PushTokenAttributes {
    id: string;
    userId: number;
    title: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}

type PushTokenCreationAttributes = Optional<PushTokenAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class PushToken extends Model<PushTokenAttributes, PushTokenCreationAttributes> implements PushTokenAttributes {
    public id!: string;
    public userId!: number;
    public title!: string;
    public token!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

PushToken.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userId: {
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
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "push_tokens",
    sequelize: new Database(config.DATABASE_URI).sequelize!,
    timestamps: false,
})

export default PushToken
