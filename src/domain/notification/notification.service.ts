import { IRepositories } from "../../interface/IRepository";

export interface INotificationService {
  sendVerificationNotification(
    firstName: string,
    lastName: string,
    email: string,
    token: string | undefined
  ): Promise<void>;
}

export interface INotificationServiceFactory {
  init(repository: IRepositories): INotificationService;
}

export const notificationServiceFactory: INotificationServiceFactory = {
  init(repository: IRepositories) {
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
        )
    } catch (error) {
        console.log(error)
    }

    }

    return {
      sendVerificationNotification,
    };
  },
};
