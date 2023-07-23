import { INewsRepository } from "./domain/news/news.repository";
import * as dotenv from "dotenv";
import logger from "./utils/logger";

// Interfaces
import { IAuthenticationRepository } from "./domain/auth/auth.repository";
import { INotificationRepository } from "./domain/notification/notification.repository";
import { IUsersRepository } from "./domain/users/user.repository";

// DOMAIN -> BUSINESS LOGIC
import { authServiceFactory } from "./domain/auth/auth.service";
import { appServerFactory } from "./presentation/http/app";
import { newsServiceFactory } from "./domain/news/news.service";
import { notificationServiceFactory } from './domain/notification/notification.service';

// REPOSITORY -> ADAPTOR TO FETCH RESOURCE FROM THE ENTITIES/MODEL/DATABASE
import { authServiceRepository } from "./data/repositories/auth";
import { userServiceRepository } from "./data/repositories/user";
import { newsServiceRepository } from "./data/repositories/news";
import { notificationServiceRepository } from './data/repositories/notification';

// domain


import { userServiceFactory } from "./domain/users/user.service";

dotenv.config();

// INIT -> REPOSITORY
const authenticationRepository: IAuthenticationRepository =
  authServiceRepository.init();
const userRepository: IUsersRepository = userServiceRepository.init();
const newsRepository: INewsRepository = newsServiceRepository.init();
const notificationRepository: INotificationRepository = notificationServiceRepository.init();


const authService = authServiceFactory.init({
  newsRepository,
  authenticationRepository,
  userRepository,
  notificationRepository
});

const newsService = newsServiceFactory.init({
  newsRepository,
  authenticationRepository,
  userRepository,
  notificationRepository
});

const userService = userServiceFactory.init({
  newsRepository,
  authenticationRepository,
  userRepository,
  notificationRepository
})

const notificationService = notificationServiceFactory.init({
  newsRepository,
  authenticationRepository,
  userRepository,
  notificationRepository
})

const app = appServerFactory.init({
  authService,
  newsService,
  userService,
  notificationService
});

let server = app.listen(process.env.PORT, () => {
  logger.info(`Listening on http://localhost:${process.env.PORT}`);
});
