import { IRepositories } from "../../interface/IRepository";
import { LoginResponse, RegisterResponse } from "../../interface/IResponse";
import { User } from "../users/model";
import { IncomingHttpHeaders } from "http";

// SERVICE INTERFACE
export interface IAuthService {
  register(
    email: string,
    headers: IncomingHttpHeaders
  ): Promise<RegisterResponse>;
  login(code: string, fcmtoken?: string, title?: string): Promise<LoginResponse>;
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

        const rand = (min: number, max: number) => {
          return Math.floor(Math.random() * (max - min + 1) + min)
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

    function tokenGenerator(rand: (min: number, max: number) => number) {
      let val = "";
      for (let i = 0; i < 5; i += 1) {
        val += `${rand(0, 10)}`;
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

    async function login(code: string, fcmtoken?: string, title?: string): Promise<LoginResponse> {
      return new Promise((resolve, reject) => {
        repositories.authenticationRepository
          .getValidateCode(code)
          .then(async (response) => {
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
              return;
            }

            await updateFCMToken(response, fcmtoken, title);
            
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

    async function updateFCMToken(user: User, title?: string, fcmtoken?: string) {
      return new Promise((resolve, reject) => {
        if (fcmtoken && title) {
          repositories.userRepository.updatePushToken(fcmtoken, user, title).then(response => {
            resolve(response);
          }).catch(error => reject(error));
        }
      })
    }

    return {
      register,
      login,
    };
  },
};
