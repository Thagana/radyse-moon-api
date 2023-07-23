import nodemailer from 'nodemailer';
import { INotificationRepository } from "../../../domain/notification/notification.repository";
import { configs } from '../../../configs/app.configs';
import ejs from 'ejs';
import path from 'path';

export interface INotificationRepositoryFactory {
  init(): INotificationRepository;
}

export const notificationServiceRepository: INotificationRepositoryFactory = {
  init() {
    async function sendVerificationNotification(firstName: string, lastName: string, email: string, token: string) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.mail.yahoo.com',
          port: 465,
          service: 'yahoo',
          secure: false,
          auth: {
            user: configs.MAIL_USER_NAME,
            pass: configs.MAIL_PASSWORD,
          },
          debug: false,
          logger: true,
        });

        const html = await ejs.renderFile(
          path.join(__dirname, '../../../views/verify_account.ejs'),
          {
            token: token,
            username: `${firstName} ${lastName}`,
          },
          { async: true },
        );

        const options = {
          from: configs.MAIL_USER_NAME,
          to: email,
          subject: 'Activate your account',
          html: html,
        };
        await transporter.sendMail(options);
      } catch (error) {
        console.error(error);
      }
    }
    return {
      sendVerificationNotification,
    };
  },
};
