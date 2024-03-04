// import { JwtPayload } from "jsonwebtoken";
import { User } from "../users/model";

/**
 * Interface for Authentication Repository.
 */
export interface IAuthenticationRepository {
  /**
   * Get a User object if the given code matches a user's token, otherwise returns false.
   * @param code - The code to validate against a user's token.
   * @returns A Promise that resolves with a User object if the code is valid, or false otherwise.
   */
  getValidateCode(code: string): Promise<User | boolean>;

  /**
   * Get a JWT token for the given user.
   * @param user - The user object to generate the token for.
   * @returns The JWT token string.
   */
  getJwtToken(user: User): string;

  /**
   * Send mail to the specified user.
   * @param username - The username of the recipient.
   * @param email - The email address of the recipient.
   * @param password - The password of the recipient.
   * @returns A Promise that resolves to true if the mail is sent successfully, false otherwise.
   */
  sendMail(username: string, email: string, password: string): Promise<boolean>;

  /**
   * Generate a link based on the provided email.
   * @param email - The email to generate the link for.
   * @returns The generated link string.
   */
  generateLink(email: string): string;

  /**
   * Hash a password with the provided salt.
   * @param salt - The salt value for the password hashing.
   * @param password - The password to hash.
   * @returns A Promise that resolves to the hashed password string.
   */
  hashPassword(salt: number, password: string): Promise<string>;

  /**
   * Verify an account using the provided token.
   * @param token - The verification token.
   * @returns A Promise that resolves to true if the account is verified, false otherwise.
   */
  verifyAccount(token: string): Promise<boolean>;

  /**
   * Check if a password matches the hashed password.
   * @param password - The plain password to check.
   * @param hashedPassword - The hashed password to compare against.
   * @returns true if the passwords match, false otherwise.
   */
  checkHashedPassword(password: string, hashedPassword: string): boolean;

  /**
   * Update the FCM token for a specific user.
   * @param userId - The user ID to update the FCM token for.
   * @param token - The new FCM token value, can be undefined.
   * @returns A Promise that resolves when the FCM token is updated.
   */
  updateFCMToken(userId: number, token: string | undefined): Promise<void>;

  /**
   * Create a token for the specified user ID.
   * @param userId - The user ID to create the token for.
   * @returns The created token string.
   */
  createToken(userId: number): string;
}
