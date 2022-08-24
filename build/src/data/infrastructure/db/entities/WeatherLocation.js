"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("../index");
const db_configs_1 = __importDefault(require("../../../../configs/db.configs"));
class WeatherLocation extends sequelize_1.Model {
}
WeatherLocation.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    user_id: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    longitude: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
    latitude: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
}, {
    tableName: "weather_location",
    sequelize: new index_1.Database(db_configs_1.default.DATABASE_URI).sequelize,
    timestamps: false,
});
exports.default = WeatherLocation;
