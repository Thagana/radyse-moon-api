"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const devConfigs = {
    MAIL_USER_NAME: process.env.MAIL_USER_NAME || '',
    MAIL_PASSWORD: process.env.MAIL_PASSWORD || '',
    NEW_ENDPOINT: process.env.NEWS_TOKEN || '',
    GOOGLE_OAUTH_SECRETE: process.env.GOOGLE_OAUTH_SECRETE || '',
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
    TOKEN_SECRET: process.env.TOKEN_SECRET || '',
    WEATHER_API_KEY: process.env.WEATHER_API_KEY || '',
    MAIL_HOST: process.env.MAIL_HOST || '',
    WEB_PUSH_CONTACT: process.env.WEB_PUSH_CONTACT || '',
    PUBLIC_VAPID_KEY: process.env.PUBLIC_VAPID_KEY || '',
    PRIVATE_VAPID_KEY: process.env.PRIVATE_VAPID_KEY || '',
    URL: 'http://localhost:3001',
    SENTRY_DNS: process.env.SENTRY_DNS || '',
    PAY_STACK_SECRET: process.env.PAY_STACK_SECRET || '',
    returnUrl: 'http://localhost:3001/subscription',
    CRON_KEY: process.env.CRON_KEY || '',
};
const prodConfigs = {
    MAIL_USER_NAME: process.env.MAIL_USER_NAME || '',
    MAIL_PASSWORD: process.env.MAIL_PASSWORD || '',
    NEW_ENDPOINT: process.env.NEWS_TOKEN || '',
    GOOGLE_OAUTH_SECRETE: process.env.GOOGLE_OAUTH_SECRETE || '',
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
    TOKEN_SECRET: process.env.TOKEN_SECRET || '',
    WEATHER_API_KEY: process.env.WEATHER_API_KEY || '',
    MAIL_HOST: process.env.MAIL_HOST || '',
    WEB_PUSH_CONTACT: process.env.WEB_PUSH_CONTACT || '',
    PUBLIC_VAPID_KEY: process.env.PUBLIC_VAPID_KEY || '',
    PRIVATE_VAPID_KEY: process.env.PRIVATE_VAPID_KEY || '',
    URL: 'https://theultimatenews.xyz',
    SENTRY_DNS: process.env.SENTRY_DNS || '',
    PAY_STACK_SECRET: process.env.PAY_STACK_SECRET || '',
    returnUrl: process.env.PAY_STACK_RETURN_URL || '',
    CRON_KEY: process.env.CRON_KEY || '',
};
exports.configs = process.env.NODE_ENV === 'production' ? prodConfigs : devConfigs;
