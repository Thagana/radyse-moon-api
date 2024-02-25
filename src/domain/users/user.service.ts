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
    return {
      getSettings,
    };
  },
};
