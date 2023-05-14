import { INewsServiceFactory } from "./domain/news/news.service";
import { INewsRepository } from "./domain/news/news.repository";
import { Database } from "./data/infrastructure/db";
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

dotenv.config();

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
