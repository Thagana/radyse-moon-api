import jwt from "jsonwebtoken";
import { configs } from "../../../configs/app.configs";
import User from "../../infrastructure/db/entities/User";
import * as bcrypt from "bcrypt";
import { IAuthenticationRepository } from "../../../domain/auth/auth.repository";
import { Mailer } from "../../../helpers/Mailer/Mailer";
import PushToken from "../../infrastructure/db/entities/PushTokens";

interface IAuthRepositoryFactory {
  init(): IAuthenticationRepository;
}

export const authServiceRepository: IAuthRepositoryFactory = {
  init(): IAuthenticationRepository {
    function getJwtToken(user: User): string {
      const jwtToken = jwt.sign({ id: user.id }, configs.TOKEN_SECRET);
      return jwtToken;
    }

    /**
     * Returns a User object if the given code matches a user's token,
     * otherwise returns false.
     *
     * @param {string} code - The code to validate against a user's token.
     * @return {Promise<User | boolean>} - A Promise that resolves with a User
     * object if the code is valid, or false otherwise.
     */
    async function getValidateCode(code: string): Promise<User | boolean> {
      return new Promise<User | boolean>((resolve, reject) => {
        User.findOne({
          where: {
            token: code,
          },
        })
          .then((user) => {
            if (user) {
              resolve(user);
            } else {
              resolve(false);
            }
          })
          .catch((error) => reject(error));
      });
    }

    async function sendMail(username: string, email: string, token: string) {
      return new Promise<boolean>((resolve, reject) => {
        Mailer.sendVerifyEmail(email, token)
          .then((results) => {
            if (results) {
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    }

    function generateLink(alpha: string) {
      let link = "";
      for (let i = 0; i < 4; i++) {
        link += alpha[(Math.random() * alpha.length) | 0];
      }
      return link;
    }

    async function hashPassword(salt: number, password: string) {
      const saltString = await bcrypt.genSalt(salt);
      return await bcrypt.hash(password, saltString);
    }

    async function verifyAccount(token: string) {
      try {
        const user = await User.findOne({
          where: {
            token: token,
          },
        })
        if (!user) {
          return false;
        }
        await User.update(
          {
            verified: 1,
          },
          {
            where: {
              token: token,
            },
          }
        );
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    function checkHashedPassword(
      password: string,
      userPassword: string
    ): boolean {
      return bcrypt.compareSync(password, userPassword);
    }
    async function updateFCMToken(id: number, fcmtoken: string) {
      if (fcmtoken) {
        const hasToken = await PushToken.findOne({
          where: {
            token: fcmtoken,
          },
        });
        if (hasToken) {
          await PushToken.update(
            {
              token: fcmtoken,
            },
            {
              where: {
                userId: id,
              },
            }
          );
        } else {
          await PushToken.create({
            title: "tagging",
            userId: id,
            token: fcmtoken,
          });
        }
      }
    }
    function createToken(id: number) {
      const token = jwt.sign({ id: id }, configs.TOKEN_SECRET || "");
      return token;
    }
    return {
      createToken,
      updateFCMToken,
      checkHashedPassword,
      verifyAccount,
      hashPassword,
      generateLink,
      getJwtToken,
      getValidateCode,
      sendMail,
    };
  },
};
