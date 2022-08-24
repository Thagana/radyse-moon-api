"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    DB_NAME: process.env.DB_NAME || "",
    DB_HOST: process.env.DB_HOST || "",
    DB_PORT: process.env.DB_PORT || "",
    DIALECT: process.env.DIALECT || "",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_USER_NAME: process.env.DB_USER_NAME || "",
    MONGO_DB_URI: process.env.MONGO_DB_URI || "",
    DATABASE_CONNECTION: process.env.DATABASE_CONNECTION || "",
    DATABASE_URI: process.env.DATABASE_URI || ""
};
exports.default = config;
