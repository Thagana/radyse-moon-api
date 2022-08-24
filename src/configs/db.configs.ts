import dotenv from 'dotenv';

dotenv.config(); 

const config = {
  DB_NAME: process.env.DB_NAME || "",
  DB_HOST: process.env.DB_HOST || "",
  DB_PORT: process.env.DB_PORT || "",
  DIALECT: process.env.DIALECT || "",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_USER_NAME: process.env.DB_USER_NAME || "",
  MONGO_DB_URI: process.env.MONGO_DB_URI || "",
  DATABASE_CONNECTION: process.env.DATABASE_URI || "",
  DATABASE_URI: process.env.DATABASE_URI || ""
};

export default config;
