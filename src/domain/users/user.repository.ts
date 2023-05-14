import { User } from "./model";
import { RegisterResponse } from "../../interface/IResponse";
import { IncomingHttpHeaders } from "http";

export interface IUsersRepository {
  createUser(
    email: string,
    token: string,
    headers: IncomingHttpHeaders
  ): Promise<RegisterResponse>;
  findUser(email: string): Promise<User | false>;
  updateToken(token: string, user: User): Promise<boolean>;
  updatePushToken(token: string, user: User, title: string): Promise<boolean>;
  getSettings(id: number): Promise<{
    language: string;
    location: string;
    category: string;
    frequency: number;
    push_enabled: number;
    email_notification: number;
    web_push_notification: number;
    sms_notification: number;
  }>;
}
