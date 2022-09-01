// import { JwtPayload } from "jsonwebtoken";
import { User } from "../users/model";

export interface IAuthenticationRepository {
  getValidateCode(code: string): Promise<User | boolean>;
  getJwtToken(user: User): string;
  sendMail(username: string, email: string, password: string): Promise<boolean>;
}
