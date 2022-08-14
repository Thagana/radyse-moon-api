import { Database } from "./data/infrastructure/db";
import * as dotenv from "dotenv";
import logger from "./utils/logger";
import signals from "./signals";

// Interfaces
import { IAuthenticationRepository } from "./domain/auth/auth.repository";

// DOMAIN -> BUSINESS LOGIC
import { authServiceFactory } from "./domain/auth/auth.service";

// REPOSITORY -> ADAPTOR TO FETCH RESOURCE FROM THE ENTITIES/MODEL/DATABASE
import { authServiceRepository } from "./data/repositories/auth";

import { appServerFactory } from "./presentation/http/app";
import { userServiceRepository } from "./data/repositories/user";

dotenv.config({ path: '../.env' });

const db = new Database(process.env.DATABASE_URI || '');

// INIT -> REPOSITORY
const authenticationRepository: IAuthenticationRepository =
  authServiceRepository.init();
const userRepository = userServiceRepository.init();

const authService = authServiceFactory.init({
  authenticationRepository,
  userRepository
});

const app = appServerFactory.init({
  authService,
});

let server = app.listen(process.env.PORT, () => {
  logger.info(`Listening on *:${process.env.PORT}`);
});

const shutdown = signals.init(async () => {
  await db.close();
  server.close();
});

(async () => {
  try {
    db.authenticate();
  } catch (error) {
    await shutdown();
  }
})();

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
