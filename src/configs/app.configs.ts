import * as dotenv from 'dotenv';

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
}

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
}

export const configs = process.env.NODE_ENV === 'production' ? prodConfigs : devConfigs;

