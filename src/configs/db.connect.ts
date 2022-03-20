import { Sequelize } from "sequelize";
import configs from "./db.configs";

const { DATABASE_CONNECTION } = configs;

const db = new Sequelize(DATABASE_CONNECTION);

export const SQ = db;

db.authenticate()
  .then(() => console.log("Successfully connected to the database"))
  .catch((error) => console.log(error));

export default db;
