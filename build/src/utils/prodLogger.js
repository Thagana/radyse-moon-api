"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const app_configs_1 = require("../configs/app.configs");
const winston_transport_sentry_node_1 = __importDefault(require("winston-transport-sentry-node"));
const { timestamp, combine, errors, json } = winston_1.format;
const options = {
    sentry: {
        dsn: app_configs_1.configs.SENTRY_DNS,
    },
    level: 'error'
};
function buildProdLogger() {
    return (0, winston_1.createLogger)({
        format: combine(timestamp(), errors({ stack: true }), json()),
        transports: [
            new winston_transport_sentry_node_1.default(options)
        ],
    });
}
exports.default = buildProdLogger;
