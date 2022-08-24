"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQ = void 0;
const sequelize_1 = require("sequelize");
const logger_1 = __importDefault(require("../utils/logger"));
const db_configs_1 = __importDefault(require("./db.configs"));
const { DATABASE_CONNECTION } = db_configs_1.default;
const db = new sequelize_1.Sequelize(DATABASE_CONNECTION);
exports.SQ = db;
db.authenticate().then(() => logger_1.default.info("Successfully connected to the database")).catch((error) => logger_1.default.error(error));
exports.default = db;
