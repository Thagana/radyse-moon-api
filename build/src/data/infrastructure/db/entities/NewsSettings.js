"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("../index");
const db_configs_1 = __importDefault(require("../../../../configs/db.configs"));
class NewsSettings extends sequelize_1.Model {
}
NewsSettings.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    language: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    frequency: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
    },
    push_enabled: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0
    },
    sms_notification: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0
    },
    email_notification: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0
    },
    web_push_notification: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "news_settings",
    sequelize: new index_1.Database(db_configs_1.default.DATABASE_URI).sequelize,
    timestamps: false,
});
exports.default = NewsSettings;
