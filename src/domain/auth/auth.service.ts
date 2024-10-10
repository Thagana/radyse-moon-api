import { IRepositories } from "../../interface/IRepository";
import { RegisterResponse } from "../../interface/IResponse";
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
  /**
   * Authenticates a user by logging them in.
   *
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   * @param {string} [fcmtoken] - The FCM token for push notifications.
   * @return {Promise<{success: boolean, message: string, data?: {profile: {firstName: string, lastName: string, fullName: string, email: string, avatar: string}}}>} - A promise that resolves to an object containing the success status, a message, and optionally the user's profile data.
   */
  login(
    email: string,
    password: string,
    fcmtoken?: string
  ): Promise<{
    success: boolean;
    message: string;
    data?: {
      profile: {
        firstName: string;
        lastName: string;
        fullName: string;
        email: string;
        avatar: string;
      };
    };
  }>;
  verify(token: string): Promise<{
    success: boolean;
    message: string;
  }>;
  forgotPasswordRequest(email: string): Promise<{
    success: boolean;
    message: string;
    data?: {
      token: string;
      email: string;
      username: string;
    }
  }>;
  resetPassword(token: string, password: string): Promise<{
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
        const isValidData = validateRegisterInputData({
          firstName,
          lastName,
          email,
          password,
        });

        if (isValidData.length > 0) {
          return {
            success: false,
            message: "Invalid form data",
            errors: isValidData,
          };
        }

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
          message: "Successfully registered",
          token: emailCode,
        };
      } catch (error) {
        console.log({ error });
        return {
          success: false,
          message: "Something went wrong, please try again later",
        };
      }
    }

    function validateRegisterInputData(payload: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) {
      const errors = [];
      if (!payload.email) {
        errors.push({
          message: "Email is required",
        });
      }
      if (!payload.password) {
        errors.push({
          message: "Password is required",
        });
      }
      if (!payload.firstName) {
        errors.push({
          message: "First Name is required",
        });
      }
      if (!payload.lastName) {
        errors.push({
          message: "Last Name is required",
        });
      }
      return errors;
    }

    function validateLoginInputData(payload: {
      email: string;
      password: string;
    }) {
      const errors = [];
      if (!payload.email) {
        errors.push({
          message: "Email is required",
        });
      }
      if (typeof payload.email !== "string") {
        errors.push({
          message: "Email must be a string",
        });
      }
      if (!payload.password) {
        errors.push({
          message: "Password is required",
        });
      }
      if (typeof payload.password !== "string") {
        errors.push({
          message: "Password must be a string",
        });
      }
      return errors;
    }
    async function login(email: string, password: string, fcmtoken?: string) {
      try {
        const isValidData = validateLoginInputData({
          email,
          password,
        });
        if (isValidData.length > 0) {
          return {
            success: false,
            errors: isValidData,
            message: "Invalid form data",
          };
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

        const token = repositories.authenticationRepository.createToken(
          user.id
        );

        await repositories.authenticationRepository.updateFCMToken(
          user.id,
          fcmtoken
        );

        return {
          success: true,
          message: "Successfully loggedIn",
          data: {
            token,
            profile: {
              firstName: user.firstName,
              lastName: user.lastName,
              fullName: `${user.firstName} ${user.lastName}`,
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

    async function verify(token: string): Promise<{
      success: boolean;
      message: string;
    }> {
      try {
        const result =
          await repositories.authenticationRepository.verifyAccount(token);
        if (!result) {
          return {
            success: false,
            message: "Something went wrong",
          };
        }
        return {
          success: true,
          message: "Successfully verified",
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          message: "Something went wrong",
        };
      }
    }

    async function forgotPasswordRequest(email: string): Promise<{
      success: boolean;
      message: string;
      data?: {
        token: string;
        email: string;
        username: string;
      }
    }> {
      try {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await repositories.userRepository.findUser(email);
        if (typeof user == 'boolean') {
          return {
            success: false,
            message: "User not found",
          }
        }
        const result =
          await repositories.userRepository.updateForgotPasswordCode(
            verificationCode,
            email,
          );
        if (!result) {
          return {
            success: false,
            message: "Something went wrong",
          };
        }
        return {
          success: true,
          message: "Successfully sent",
          data: {
            token: verificationCode,
            username: `${user.firstName} ${user.lastName}`,
            email,
          }
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          message: "Something went wrong",
        };
      }
    }
    async function resetPassword(
      token: string,
      password: string
    ) {
      try {
        const hashedPassword = await repositories.authenticationRepository.hashPassword(
          10,
          password
        )
        const result =
          await repositories.userRepository.updatePassword(token, hashedPassword);
        if (!result) {
          return {
            success: false,
            message: "Something went wrong, failed to update password",
          };
        }
        return {
          success: true,
          message: "Successfully updated",
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          message: "Something went wrong, please try again later",
        };
      }
    }
    return {
      forgotPasswordRequest,
      resetPassword,
      verify,
      register,
      login,
    };
  },
};
