import { Model, DataTypes, Optional } from "sequelize";
import { Database } from "../index";
import config from '../../../../configs/db.configs';

export interface NewsSettingsAttribute {
    id: number;
    user_id: number;
    language: string;
    location: string;
    category: string;
    frequency: number;
    push_enabled: number;
    email_notification: number;
    web_push_notification: number;
    sms_notification: number;
}

type NewsSettingsCreationAttributes = Optional<NewsSettingsAttribute, 'id' | 'frequency'| 'push_enabled'| 'email_notification' | 'sms_notification' | 'web_push_notification'>;

class NewsSettings extends Model<NewsSettingsAttribute, NewsSettingsCreationAttributes> implements NewsSettingsAttribute {
    public id!: number;
    public user_id!: number;
    public language!: string;
    public location!: string;
    public category!: string;
    public frequency!: number;
    public push_enabled!: number;
    public email_notification!: number;
    public web_push_notification!: number;
    public sms_notification!: number;
}

NewsSettings.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    language: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    frequency: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
    },
    push_enabled: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    sms_notification: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    email_notification: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    web_push_notification: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "news_settings",
    sequelize: new Database(config.DATABASE_URI).sequelize!,
    timestamps: false,
});

export default NewsSettings;