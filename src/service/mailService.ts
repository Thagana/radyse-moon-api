import nodemailer from "nodemailer";
import Logger from "../utils/logger";
import {configs}  from "../configs/app.configs";

class sendMail {
  username: string;

  email: string;

  token: string;

  constructor(username: string, email: string, token: string) {
    this.username = username;
    this.email = email;
    this.token = token;
  }

  async send(): Promise<boolean> {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: configs.MAIL_USER_NAME,
          pass: configs.MAIL_PASSWORD,
        },
      });
      const message = {
        from: configs.MAIL_USER_NAME,
        to: this.email,
        subject: "verify account",
        html: `<html>
                        <div>
                            <div>Welcome to Sleepy bears click on the link to active your account<div>
                            <div>Click here: ${this.token}</div>
                            <div>If you did not make this request please ignore</div>
                        </div>
              </html>`,
      };
      await transporter.sendMail(message);
      return true;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }

  static async sendContactInformation(email: string, name: string, message: string) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: configs.MAIL_USER_NAME,
          pass: configs.MAIL_PASSWORD,
        },
      });
      const data = {
        from: configs.MAIL_USER_NAME,
        to: email,
        subject: `You have a new Contact request from ${name}`,
        html: `<html>
                        <div>
                            <div>
                              message: ${message}
                            </div>
                        </div>
              </html>`,
      };
      await transporter.sendMail(data);
      return true;      
    } catch (error) {
      return false
    }
  }
}

export default sendMail;
