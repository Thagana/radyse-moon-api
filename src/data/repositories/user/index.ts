// DOA
import User from "../../infrastructure/db/entities/User";
import NewsSettingsDOA from "../../infrastructure/db/entities/NewsSettings";
import UserMetaDOA from "../../infrastructure/db/entities/UserMeta";
import PushTokensDOA from "../../infrastructure/db/entities/PushTokens";
import parser from "ua-parser-js";
import { Database } from "../../infrastructure/db/index";

import { IUsersRepository } from "../../../domain/users/user.repository";
import { Mailer } from "../../../helpers/Mailer/Mailer";
import { IncomingHttpHeaders } from "http";

interface IUsersRepositoryFactory {
  init(): IUsersRepository;
}

export const userServiceRepository: IUsersRepositoryFactory = {
  init(): IUsersRepository {
    async function createUser(
      firstName: string,
      lastName: string,
      email: string,
      hashPassword: string,
      emailCode: string,
      headers: IncomingHttpHeaders
    ): Promise<{ success: boolean; message: string }> {
      const db = new Database(process.env.DATABASE_URI || "");
      const transaction = await db.sequelize.transaction();
      return new Promise<{
        success: boolean;
        message: string;
      }>(async (resolve, reject) => {
        try {
          // CREATE USER
          const user = await User.create({
            email: email,
            token: emailCode,
            first_name: firstName,
            last_name: lastName,
            password: hashPassword,
            avatar:
              "https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4",
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

          // SEND MAIL
          const mailer = await Mailer.sendVerifyEmail(user.email, emailCode);
          if (!mailer) {
            reject({
              success: false,
              message: "Could not send mail",
            });
          } else {
            resolve({
              success: true,
              message: "Successfully registered",
            });
          }
        } catch (error) {
          console.log(error);
          await transaction.rollback();
          reject({
            success: false,
            message: "Something went wrong please try again later",
          });
        }
      });
    }
    async function findUser(email: string) {
      return new Promise<User | boolean>((resolve, reject) => {
        User.findOne({
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
        PushTokensDOA.update(
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

    /**
     *
     * @param token
     * @param user
     * @param title
     * @returns
     */
    async function updatePushToken(token: string, user: User, title: string) {
      return new Promise<boolean>(async (resolve, reject) => {
        try {
          const oldToken = await PushTokensDOA.findOne({
            where: {
              userId: user.id,
            },
          });
          if (oldToken) {
            await PushTokensDOA.update(
              {
                token: token,
              },
              {
                where: {
                  userId: user.id,
                },
              }
            );
          } else {
            await PushTokensDOA.create({
              userId: user.id,
              token: token,
              title: title,
            });
          }
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    }

    async function getSettings(id: string) {
      return new Promise<{
        language: string;
        location: string;
        category: string;
        frequency: number;
        push_enabled: number;
        email_notification: number;
        web_push_notification: number;
        sms_notification: number;
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
      updatePushToken,
    };
  },
};
