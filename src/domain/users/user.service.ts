import { Settings } from "../../interface/Settings.interface";
import { IRepositories } from "./../../interface/IRepository";
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
  updateSettings(id: number, settings: Settings): Promise<{
    success: boolean,
    message: string
  }>
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
        throw error
      }
    }
    async function updateSettings(id: number, settings: Settings) {
      try {
        await repository.userRepository.updateSettings(id, settings);
        return {
          success: true,
          message: "Successfully updated settings",
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          message: "Something went wrong, please try again later",
        }
      }
    }
    return {
      getSettings,
      updateSettings
    };
  },
};
