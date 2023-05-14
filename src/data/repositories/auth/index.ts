import jwt from "jsonwebtoken";
import { configs } from "../../../configs/app.configs";
import User from "../../infrastructure/db/entities/User";

import { IAuthenticationRepository } from "../../../domain/auth/auth.repository";
import { Mailer } from "../../../helpers/Mailer/Mailer";

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

    async function createUser(email: string) {
      return new Promise((resolve, reject) => {
        //
      });
    }

    return {
      getJwtToken,
      getValidateCode,
      sendMail,
    };
  },
};
