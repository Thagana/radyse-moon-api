import { IRepositories } from "../../interface/IRepository";
import { LoginResponse, RegisterResponse } from "../../interface/IResponse";
import { User } from "../users/model";
import { IncomingHttpHeaders } from "http";

// SERVICE INTERFACE
export interface IAuthService {
  /**
   * Registers a user with the provided email and headers.
   *
   * @param {string} email - The email of the user to be registered.
   * @param {IncomingHttpHeaders} headers - The headers of the incoming HTTP request.
   * @return {Promise<RegisterResponse>} - A promise that resolves to a RegisterResponse object.
   */
  register(
    email: string,
    headers: IncomingHttpHeaders
  ): Promise<RegisterResponse>;
  /**
   * Logs the user in with the provided authentication code.
   *
   * @param {string} code - The authentication code.
   * @param {string} [fcmtoken] - The Firebase Cloud Messaging token.
   * @param {string} [title] - The title of the login request.
   * @return {Promise<LoginResponse>} The login response.
   */
  login(
    code: string,
    fcmtoken?: string,
    title?: string
  ): Promise<LoginResponse>;
}

// SERVICE FACTORY -> CREATING NEW SERVICE USING THE SERVICE FACTORY PATTERN
interface IAuthServiceFactory {
  init(repositories: IRepositories): IAuthService;
}

export const authServiceFactory: IAuthServiceFactory = {
  init(repositories: IRepositories) {
    /**
     * Asynchronously registers a user by creating a new user account if the provided email is not already registered.
     * If user exists, sends a verification code to the email address associated with the user, updates the user's token and returns a successful response.
     * Otherwise, creates a new user account with the given details and returns the result of the operation.
     *
     * @async
     * @function register
     * @param {string} email - The email of the user to register
     * @param {IncomingHttpHeaders} headers - The headers object containing metadata associated with the request
     * @return {Promise<RegisterResponse>} - A promise that resolves to a RegisterResponse object indicating the success or failure of the operation
     */
    async function register(
      email: string,
      headers: IncomingHttpHeaders
    ): Promise<RegisterResponse> {
      try {
        const user = await repositories.userRepository.findUser(email);

        const rand = (min: number, max: number) => {
          return Math.floor(Math.random() * (max - min + 1) + min);
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
        const createUser = await repositories.userRepository.createUser(
          email,
          token,
          headers
        );
        return createUser;
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

    async function login(
      code: string,
      fcmtoken?: string,
      title?: string
    ): Promise<LoginResponse> {
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
              return;
            }
            updateFCMToken(response, fcmtoken, title)
              .then()
              .catch((error) => {
                console.log(error);
              });

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

    /**
     *
     * @param user
     * @param fcmtoken
     * @param title
     * @returns
     */
    async function updateFCMToken(
      user: User,
      fcmtoken?: string,
      title?: string
    ) {
      return new Promise((resolve, reject) => {
        if (fcmtoken && title) {
          repositories.userRepository
            .updatePushToken(fcmtoken, user, title)
            .then((response) => {
              resolve(response);
            })
            .catch((error) => reject(error));
        }
      });
    }

    return {
      register,
      login,
    };
  },
};
