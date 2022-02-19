import { Sequelize } from "sequelize";
import configs from "./db.configs";

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER_NAME, DIALECT } =
  configs;

const db = new Sequelize(
  `${DIALECT}://${DB_USER_NAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
);

export const SQ = db;

db.authenticate()
  .then(() => console.log("Successfully connected to the database"))
  .catch((error) => console.log(error));

export default db;
