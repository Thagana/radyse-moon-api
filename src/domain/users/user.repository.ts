import { Settings } from "../../interface/Settings.interface";
import { User } from "./model";
import { IncomingHttpHeaders } from "http";

export interface IUsersRepository {
  createUser(
    firstName: string,
    lastName: string,
    email: string,
    hashPassword: string,
    emailCode: string,
    headers: IncomingHttpHeaders
  ): Promise<{
    success: boolean;
    message: string;
  }>;
  findUser(email: string): Promise<User | boolean>;
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
  getUsers(): Promise<User[]>;
  getPushTokens(users: {userId: number}[]): Promise<string[]>;
  updateSettings(id: number, settings: Settings): Promise<void>;
}
