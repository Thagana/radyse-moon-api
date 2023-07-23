import { IRepositories } from "./../../interface/IRepository";
export interface IUserService {
  getSettings(id: string): Promise<{
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

export interface IUserServiceFactory {
  init(repository: IRepositories): IUserService;
}

export const userServiceFactory = {
  init(repository: IRepositories) {
    async function getSettings(id: string) {
      try {
        const settings = await repository.userRepository.getSettings(id);
        return settings;
      } catch (error) {
        throw error
      }
    }
    return {
      getSettings,
    };
  },
};
