import nodemailer from 'nodemailer';
import { Expo } from 'expo-server-sdk';
import { INotificationRepository } from "../../../domain/notification/notification.repository";
import { configs } from '../../../configs/app.configs';
import ejs from 'ejs';
import path from 'path';
import { User } from '../../../domain/users/model';
import PushTokens from '../../infrastructure/db/entities/PushTokens';

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
    async function sendCropPushNotification(data: {title: string, description: string}[], pushTokens: string[]) {
      try {
        const expo = new Expo();
        const messages = [];
        for (const pushToken of pushTokens) {
          if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
          }
          for (const payload of data) {
            messages.push({
              to: pushToken,
              body: payload.description,
              title: payload.title,
            })
          }
        }
        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];
        for (const chunk of chunks) {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
        }
      } catch (error) {
        console.error(error);   
      }
    }

    async function getPushTokens(users: User[]) {
      return new Promise<string[]>((resolve, reject) => {
        PushTokens.findAll({
          where: {
            userId: {
              in: users.map((user) => user.id),
            },
          },
        }).then((response) => {
          resolve(response.map((item) => item.token));
        }).catch((error) => {
          reject(error);
        })
      })
    }
    return {
      getPushTokens,
      sendVerificationNotification,
      sendCropPushNotification
    };
  },
};
