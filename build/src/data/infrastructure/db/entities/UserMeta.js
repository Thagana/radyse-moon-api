"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("../index");
const db_configs_1 = __importDefault(require("../../../../configs/db.configs"));
class UserMeta extends sequelize_1.Model {
}
UserMeta.init({
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
    browser_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    browser_version: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    device_model: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    device_type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    device_vendor: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    os_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    os_version: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    engine_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    cpu_architecture: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "user_meta",
    sequelize: new index_1.Database(db_configs_1.default.DATABASE_URI).sequelize,
    timestamps: false,
});
exports.default = UserMeta;
