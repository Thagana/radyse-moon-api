import { Sequelize } from "sequelize";
import logger from "../utils/logger";
import configs from "./db.configs";

const { DATABASE_CONNECTION } = configs;

const db = new Sequelize(DATABASE_CONNECTION, {
    dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	},
});

export const SQ = db;

db.authenticate().then(() => logger.info("Successfully connected to the database")).catch((error) => logger.error(error));

export default db;
