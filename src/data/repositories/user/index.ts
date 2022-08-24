import UserDOA from "../../infrastructure/db/entities/User";
import NewsSettingsDOA from "../../infrastructure/db/entities/NewsSettings";
import UserMetaDOA from "../../infrastructure/db/entities/UserMeta";
import parser from "ua-parser-js";

import { User } from "../../../domain/users/model";

import { IUsersRepository } from "../../../domain/users/user.repository";
import { RegisterResponse } from "../../../interface/IResponse";
import { Mailer } from "../../../helpers/Mailer/Mailer";
import { IncomingHttpHeaders } from "http";

interface IUsersRepositoryFactory {
  init(): IUsersRepository;
}

export const userServiceRepository: IUsersRepositoryFactory = {
  init(): IUsersRepository {
    async function createUser(
      email: string,
      token: string,
      headers: IncomingHttpHeaders
    ) {
      return new Promise<RegisterResponse>(async (resolve, reject) => {
        try {
          // CREATE USER
          const user = await UserDOA.create({
            first_name: "first_name",
            last_name: "last_name",
            email,
            avatar:
              "https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4",
            token: token,
          });
          // CREATE NEWS SETTINGS
          await NewsSettingsDOA.create({
            user_id: user.id,
            language: "en",
            location: "ZA",
            frequency: 3,
            category: "general",
            push_enabled: 0,
            email_notification: 0,
            web_push_notification: 0,
          });
          // CREATE USER META
          const UA = parser(headers["user-agent"]);
          const browserName = UA.browser.name || "X_AVAIL";
          const browserVersion = UA.browser.version || "X_AVAIL";
          const deviceModel = UA.device.model || "X_AVAIL";
          const deviceVendor = UA.device.vendor || "X_AVAIL";
          const deviceType = UA.device.type || "X_AVAIL";
          const osName = UA.os.name || "X_AVAIL";
          const osVersion = UA.os.version || "X_AVAIL";
          const cpuArch = UA.cpu.architecture || "X_AVAIL";
          const engine = UA.engine.name || "X_AVAIL";

          await UserMetaDOA.create({
            browser_name: browserName,
            browser_version: browserVersion,
            device_model: deviceModel,
            device_vendor: deviceVendor,
            device_type: deviceType,
            os_name: osName,
            os_version: osVersion,
            cpu_architecture: cpuArch,
            engine_name: engine,
            user_id: user.id,
          });
          // SEND MAIL
          const mailer = await Mailer.sendVerifyEmail(user.email, token); 
          if (!mailer) {
            return {
              success: false,
              message: "Could not send mail",
            };
          }
          return {
            success: true,
            message: "Successfully registered",
          };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            message: "Something went wrong please try again later",
          };
        }
      });
    }
    async function findUser(email: string) {
      return new Promise<User | false>((resolve, reject) => {
        UserDOA.findOne({
          where: {
            email,
          },
        })
          .then((response) => {
            if (response) {
              resolve(response);
            } else {
              resolve(false);
            }
          })
          .catch((error) => reject(error));
      });
    }
    async function updateToken(token: string, user: User) {
      return new Promise<boolean>((resolve, reject) => {
        UserDOA.update(
          {
            token: token,
          },
          {
            where: {
              id: user.id,
            },
          }
        )
          .then((response) => {
            resolve(true);
          })
          .catch((error) => reject(error));
      });
    }
    async function getSettings(id: number) {
      return new Promise<{
        language: string;
        location: string;
        category: string;
        frequency: number;
        push_enabled: number;
        email_notification: number;
        web_push_notification: number;
        sms_notification: number
      }>((resolve, reject) => {
        NewsSettingsDOA.findOne({
          where: {
            user_id: id,
          },
        })
          .then((response) => {
            if (response) {
              resolve({
                language: response.language,
                location: response.location,
                category: response.category,
                frequency: response.frequency,
                push_enabled: response.push_enabled,
                email_notification: response.email_notification,
                web_push_notification: response.web_push_notification,
                sms_notification: response.sms_notification,
              });
            }
          })
          .catch((error) => reject(error));
      });
    }
    return {
      updateToken,
      findUser,
      createUser,
      getSettings,
    };
  },
};
