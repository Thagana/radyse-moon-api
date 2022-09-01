import jwt from "jsonwebtoken";
import { configs } from "../../../configs/app.configs";
import { User } from "../../../domain/users/model";
import UserDOA from "../../infrastructure/db/entities/User";

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

    async function getValidateCode(code: string): Promise<User | boolean> {
      return new Promise<User | boolean>((resolve, reject) => {
        UserDOA.findOne({
          where: {
            token: code,
          },
        })
          .then((user) => {
            if (user) {
              resolve(user);
            }
            resolve(false);
          })
          .catch((error) => reject(error));
      });
    }
    
    async function sendMail(email: string, token: string) {
      return new Promise<boolean>((resolve, reject) => {
        Mailer.sendVerifyEmail(email, token).then(() => {resolve(true)}).catch((error: any) => reject(error));
      });
    }

    return {
      getJwtToken,
      getValidateCode,
      sendMail,
    };
  },
};
