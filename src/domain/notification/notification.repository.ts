export interface INotificationRepository {
    sendVerificationNotification(
      firstName: string,
      lastName: string,
      email: string,
      token: string | undefined,
    ): Promise<void>;
    sendCropPushNotification(
      data: { title: string; description: string }[],
      pushTokens: string[],
    ): Promise<void>;
    sendResetPasswordNotification(email: string, token: string, username: string): Promise<void>;
  }
  