"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_configs_1 = __importDefault(require("./db.configs"));
const connectionString = db_configs_1.default.MONGO_DB_URI || '';
mongoose_1.default.connect(connectionString);
const db = mongoose_1.default.connection;
exports.default = db;
