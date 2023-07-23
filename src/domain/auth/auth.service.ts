import { IRepositories } from "../../interface/IRepository";
import { LoginResponse, RegisterResponse } from "../../interface/IResponse";
import { User } from "../users/model";
import { IncomingHttpHeaders } from "http";

// SERVICE INTERFACE
export interface IAuthService {
  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    headers: IncomingHttpHeaders
  ): Promise<RegisterResponse>;
  login(
    email: string,
    password: string,
    fcmtoken?: string,
  ): Promise<{
    success: boolean,
    message: string,
    data?: {
      profile: {
        firstName: string,
        lastName: string,
        fullName: string,
        email: string,
        avatar: string,
      },
    }
  }>;
  verify(token: string): Promise<{
    success: boolean;
    message: string;
  }>;
}

interface IAuthServiceFactory {
  init(repositories: IRepositories): IAuthService;
}

export const authServiceFactory: IAuthServiceFactory = {
  init(repositories: IRepositories) {
    async function register(
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      headers: IncomingHttpHeaders
    ): Promise<RegisterResponse> {
      try {
        const ALPHABET = "0123456789";

        const emailCode =
          repositories.authenticationRepository.generateLink(ALPHABET);

        const user = await repositories.userRepository.findUser(email);

        if (user) {
          return { success: false, message: "Account already exist" };
        }

        const hashPassword =
          await repositories.authenticationRepository.hashPassword(
            10,
            password
          );

        const createUser = await repositories.userRepository.createUser(
          firstName,
          lastName,
          email,
          hashPassword,
          emailCode,
          headers
        );
        if (!createUser) {
          return {
            success: false,
            message: "Something went wrong please try again later",
          };
        }
        return {
          success: true,
          message: "successfully registered",
          token: emailCode
        };
      } catch (error) {
        console.log({ error });
        return {
          success: false,
          message: "Something went wrong, please try again later",
        };
      }
    }

    async function login(
      email: string,
      password: string,
      fcmtoken?: string,
    ) {
      try {
        // if email is provided fail
        if (!email) {
          return { success: false, message: "Email is required" };
        }
        // if password is provided fail
        if (!password) {
          return { success: false, message: "Password is required" };
        }
        // if both email and password are provided fail
        if (!email || !password) {
          return { success: false, message: "Email and password are required" };
        }
        // Email and password should be a string
        if (typeof email !== "string") {
          return { success: false, message: "Email should be a string" };
        }
        if (typeof password !== "string") {
          return { success: false, message: "Password should be a string" };
        }
        const user = await repositories.userRepository.findUser(email);

        if (typeof user === "boolean") {
          return { success: false, message: "Could not find user" };
        }
        const is_verified = user.verified;
        if (!is_verified) {
          return { success: false, message: "Not yet activated your account" };
        }
        const checkHashedPassword =
          repositories.authenticationRepository.checkHashedPassword(
            password,
            user.password
          );
        if (!checkHashedPassword) {
          return { success: false, message: "Username or password incorrect!" };
        }
        const token = repositories.authenticationRepository.createToken(user.id);


        await repositories.authenticationRepository.updateFCMToken(user.id, fcmtoken);
        return {
          success: true,
          message: "Successfully loggedIn",
          data: {
            token,
            profile: {
              firstName: user.first_name,
              lastName: user.last_name,
              fullName: `${user.first_name} ${user.last_name}`,
              email: user.email,
              avatar: user.avatar,
            },
          },
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          message: "Something went wrong",
        };
      }
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

    async function verify(token: string): Promise<{
      success: boolean;
      message: string;
    }> {
      return new Promise<{ success: boolean; message: string }>(
        (resolve, reject) => {
          repositories.authenticationRepository
            .verifyAccount(token)
            .then(() => {
              resolve({
                success: true,
                message: "Successfully verified",
              });
            })
            .catch((error) => reject(error));
        }
      );
    }

    return {
      verify,
      register,
      login,
    };
  },
};
