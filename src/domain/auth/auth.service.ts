import { IRepositories } from "../../interface/IRepository";
import { LoginResponse, RegisterResponse } from "../../interface/IResponse";
import { User } from "../users/model";
import { IncomingHttpHeaders } from "http";
import  crypto from 'crypto';

// SERVICE INTERFACE
export interface IAuthService {
  register(
    email: string,
    headers: IncomingHttpHeaders
  ): Promise<RegisterResponse>;
  login(code: string): Promise<LoginResponse>;
}

// SERVICE FACTORY -> CREATING NEW SERVICE USING THE SERVICE FACTORY PATTERN
interface IAuthServiceFactory {
  init(repositories: IRepositories): IAuthService;
}

export const authServiceFactory: IAuthServiceFactory = {
  init(repositories: IRepositories) {
    async function register(
      email: string,
      headers: IncomingHttpHeaders
    ): Promise<RegisterResponse> {
      try {
        const user = await repositories.userRepository.findUser(email);

        const rand = () => {
          const token = crypto.randomBytes(1);
          const hex = token.toString('hex');
          return parseInt(hex, 16);
        };

        const token = tokenGenerator(rand);

        if (user) {
          const sent = await sendVerificationCode(user, token);
          if (!sent.success) {
            return {
              success: false,
              message: "Could not sent mail",
            };
          }

          const updateToken = await repositories.userRepository.updateToken(
            token,
            user
          );

          if (!updateToken) {
            return {
              success: false,
              message: "Failed to update token",
            };
          }
          return {
            success: true,
            message: "Please check email, a verification code has been sent",
          };
        }

        return repositories.userRepository.createUser(email, token, headers);
      } catch (error) {
        console.log(error);
        return {
          success: false,
          message: "Something went wrong, please try again later",
        };
      }
    }

    function tokenGenerator(rand: () => number) {
      let val = "";
      for (let i = 0; i < 5; i += 1) {
        val += `${rand()}`;
      }
      return val;
    }

    async function sendVerificationCode(user: User, token: string) {
      const mailer = await repositories.authenticationRepository.sendMail(
        "NOT_UPDATED_USER",
        user.email,
        token
      );
      if (!mailer) {
        return {
          success: false,
          message: "Failed to send mail",
        };
      }
      return {
        success: true,
        message: "Please check email, for verification code",
      };
    }

    async function login(code: string): Promise<LoginResponse> {
      return new Promise((resolve, reject) => {
        repositories.authenticationRepository
          .getValidateCode(code)
          .then((response) => {
            if (!response) {
              resolve({
                success: false,
                message: "User not found",
              });
            }
            if (typeof response === "boolean") {
              resolve({
                success: false,
                message: "Could not find user token",
              });
            }
            const jwtToken = repositories.authenticationRepository.getJwtToken(
              response as User
            );

            resolve({
              success: true,
              message: "Successfully logged in",
              token: jwtToken,
            });
          })
          .catch((error) => reject(error));
      });
    }

    return {
      register,
      login,
    };
  },
};
