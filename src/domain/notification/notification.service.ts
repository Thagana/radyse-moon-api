import { IRepositories } from "../../interface/IRepository";
import util from "util";
import Article from "../../interface/articles-interface";

export interface INotificationService {
  sendVerificationNotification(
    firstName: string,
    lastName: string,
    email: string,
    token: string | undefined
  ): Promise<void>;
  sendCronFetchedArticlesNotification(fetched: Article[]): Promise<void>;
}

export interface INotificationServiceFactory {
  init(repository: IRepositories): INotificationService;
}

export const notificationServiceFactory: INotificationServiceFactory = {
  init(repository: IRepositories) {
    async function sendCronFetchedArticlesNotification(fetched: Article[]) {
      try {
        const users = await repository.userRepository.getUsers();
        let config: {userId: number}[] = [];
        for (let user of users) {
          const settings = await repository.userRepository.getSettings(user.id);
          if (settings.push_enabled) {
            config.push({
              userId: user.id,
            });
          }
        }
        const pushTokens = await repository.userRepository.getPushTokens(config);
        const messages = fetched.map((item) => {
          return {
            title: item.title,
            description: item.description,
          };
        });
        await repository.notificationRepository.sendCropPushNotification(
          messages,
          pushTokens
        );
      } catch (error) {
        console.log(error);
      }
    }
    async function sendVerificationNotification(
      firstName: string,
      lastName: string,
      email: string,
      token: string | undefined
    ): Promise<void> {
      try {
        await repository.notificationRepository.sendVerificationNotification(
          firstName,
          lastName,
          email,
          token
        );
      } catch (error) {
        console.log(error);
      }
    }

    return {
      sendVerificationNotification,
      sendCronFetchedArticlesNotification,
    };
  },
};
