import nodemailer from "nodemailer";
import Logger from "../../utils/logger";
import { configs } from "../../configs/app.configs";

export class Mailer {
  public static async sendVerifyEmail(email: string, token: string) {
    return new Promise<boolean>((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        host: "smtp.mail.yahoo.com",
        port: 465,
        service: "yahoo",
        secure: false,
        auth: {
          user: configs.MAIL_USER_NAME,
          pass: configs.MAIL_PASSWORD,
        },
        debug: false,
        logger: true,
      });
      const message = {
        from: configs.MAIL_USER_NAME,
        to: email,
        subject: "verify account",
        html: `<html>
                                <div>
                                    <div>Welcome to The Ultimate News user the OTP code to verify access<div>
                                    <div>here: ${token}</div>
                                    <div>If you did not make this request please ignore</div>
                                </div>
                      </html>`,
      };
      transporter
        .sendMail(message)
        .then((response) => {
          resolve(true);
        })
        .catch((error) => reject(error));
    });
  }
}
