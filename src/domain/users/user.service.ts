import { bool } from './../../../../radyse-moon-app/node_modules/@types/prop-types/index.d';
import { IRepositories } from "./../../interface/IRepository";
import { User } from "./model";
export interface IUserService {
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
  savePushToken(token: string, userId: number): Promise<boolean>;
  getProfile(userId: number): Promise<{
    success: boolean;
    data?: User,
    message?: string
  }>;
}

export interface IUserServiceFactory {
  init(repository: IRepositories): IUserService;
}

export const userServiceFactory = {
  init(repository: IRepositories) {
    async function getSettings(id: number) {
      try {
        const settings = await repository.userRepository.getSettings(id);
        return settings;
      } catch (error) {
        return {
          language: "",
          location: "",
          category: "",
          frequency: 0,
          push_enabled: 0,
          email_notification: 0,
          web_push_notification: 0,
          sms_notification: 0,
        };
      }
    }
    async function savePushToken(token: string, userId: number) {
      try {
        await repository.userRepository.savePushToken(token, userId);
        return true;
      } catch (error) {
        return false;
      }
    }
    async function getProfile(userId: number) {
      try {
        const profile = await repository.userRepository.getProfile(userId);
        return {
          success: true,
          data: profile
        };
      } catch (error) {
        return {
          success: false,
          message: "Something went wrong please try again later",
        }
      }
    }
    return {
      getSettings,
      savePushToken,
      getProfile
    };
  },
};
