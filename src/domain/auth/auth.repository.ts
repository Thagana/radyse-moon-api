// import { JwtPayload } from "jsonwebtoken";
import { User } from "../users/model";

export interface IAuthenticationRepository {
  //   comparePassword(password: string, dbPassword: string): Promise<boolean>;
  //   hashPassword(password: string): Promise<string>;
  //   verifyToken(token: string, secret: string): Promise<JwtPayload>;
  getValidateCode(code: string): Promise<User | boolean>;
  /**
   * Returns a JWT token for the given User object.
   *
   * @param {User} user - The User object to generate a JWT token for.
   * @return {string} A JWT token string.
   */
  getJwtToken(user: User): string;
  /**
   * Sends an email containing the user's login credentials.
   *
   * @param {string} username - The user's username.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @return {Promise<boolean>} A promise that resolves to true if the email was successfully sent.
   */
  sendMail(username: string, email: string, password: string): Promise<boolean>;
}
