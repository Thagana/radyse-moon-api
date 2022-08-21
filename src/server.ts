import { INewsServiceFactory } from "./domain/news/news.service";
import { INewsRepository } from "./domain/news/news.repository";
import { Database } from "./data/infrastructure/db";
import { Database as Mongodb } from './data/infrastructure/db/mongodb';
import * as dotenv from "dotenv";
import logger from "./utils/logger";
import signals from "./signals";

// Interfaces
import { IAuthenticationRepository } from "./domain/auth/auth.repository";

// DOMAIN -> BUSINESS LOGIC
import { authServiceFactory } from "./domain/auth/auth.service";
import { appServerFactory } from "./presentation/http/app";
import { newsServiceFactory } from "./domain/news/news.service";

// REPOSITORY -> ADAPTOR TO FETCH RESOURCE FROM THE ENTITIES/MODEL/DATABASE

import { authServiceRepository } from "./data/repositories/auth";
import { userServiceRepository } from "./data/repositories/user";
import { newsServiceRepository } from "./data/repositories/news";

// domain
import { IUsersRepository } from "./domain/users/user.repository";

dotenv.config({ path: "../.env" });

const db = new Database(process.env.DATABASE_URI || "");
const mongodb = new Mongodb(process.env.MONGO_DB_URI || "");

// INIT -> REPOSITORY
const authenticationRepository: IAuthenticationRepository =
  authServiceRepository.init();
const userRepository: IUsersRepository = userServiceRepository.init();
const newsRepository: INewsRepository = newsServiceRepository.init();

const authService = authServiceFactory.init({
  newsRepository,
  authenticationRepository,
  userRepository,
});

const newsService = newsServiceFactory.init({
  newsRepository,
  authenticationRepository,
  userRepository,
});

const app = appServerFactory.init({
  authService,
  newsService,
});

let server = app.listen(process.env.PORT, () => {
  logger.info(`Listening on *:${process.env.PORT}`);
});

const shutdown = signals.init(async () => {
  await db.close();
  await mongodb.close()
  server.close();
});

(async () => {
  try {
    db.authenticate();
    mongodb.connect();
  } catch (error) {
    await shutdown();
  }
})();

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
