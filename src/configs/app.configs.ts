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
}

const prodConfigs = {
    MAIL_USER_NAME: process.env.MAIL_USER_NAME || '',
    MAIL_PASSWORD: process.env.MAIL_PASSWORD || '',
    NEW_ENDPOINT: process.env.NEWS_TOKEN || '',
    GOOGLE_OAUTH_SECRETE: process.env.GOOGLE_OAUTH_SECRETE || '',
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
    TOKEN_SECRET: process.env.TOKEN_SECRET || '',
    WEATHER_API_KEY: process.env.WEATHER_API_KEY || '',
}

export const configs = process.env.NODE_ENV === 'production' ? prodConfigs : devConfigs;

