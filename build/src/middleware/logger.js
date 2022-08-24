"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
function logger(request, response, next) {
    const startTime = new Date().getTime();
    response.on('finish', () => {
        const endTime = new Date().getTime();
        const url = `${request.protocol}://${request.get('host')}${request.originalUrl}`;
        const ms = endTime - startTime;
        logger_1.default.info(`[METHOD: ${request.method}] - [URL: ${url}] - [STATUS: ${response.statusCode}] - [RESPONSE_TIME - ${ms}ms] - [IP: ${request.socket.remoteAddress}]`);
    });
    return next();
}
exports.default = logger;
