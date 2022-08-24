// import { JwtPayload } from "jsonwebtoken";
import { User } from "../users/model";

export interface IAuthenticationRepository {
  //   comparePassword(password: string, dbPassword: string): Promise<boolean>;
  //   hashPassword(password: string): Promise<string>;
  //   verifyToken(token: string, secret: string): Promise<JwtPayload>;
  getValidateCode(code: string): Promise<User | boolean>;
  getJwtToken(user: User): string;
  sendMail(username: string, email: string, password: string): Promise<boolean>;
}
