import { IRepositories } from "../../interface/IRepository";
import { LoginResponse } from "../../interface/IResponse";
import { User } from "../users/model";

// REPOSITORY INTERFACES
import { ICreateUser } from "../users/user.repository";

// SERVICE INTERFACE
export interface IAuthService {
  // register(createUserDto: ICreateUser): Promise<User>;
  login(code: string): Promise<LoginResponse>;
}

// SERVICE FACTORY -> CREATING NEW SERVICE USING THE SERVICE FACTORY PATTERN
interface IAuthServiceFactory {
  init(repositories: IRepositories): IAuthService;
}

export const authServiceFactory: IAuthServiceFactory = {
  init(repositories: IRepositories) {
    // async function register(user: ICreateUser): Promise<User> {
    //   return repositories.userRepository.createUser(user);
    // }

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
            const jwtToken =
              repositories.authenticationRepository.getJwtToken(response as User);

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
      login,
    };
  },
};
