import nodemailer from "nodemailer";
import Logger from "../utils/logger";
import {configs}  from "../configs/app.configs";
import logger from "../utils/logger";
import ejs from 'ejs'
import path from "path";
import DataFrame from "../interface/data-frame-interface";
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
        host: 'smtp.mail.yahoo.com',
        port: 465,
        service:'yahoo',
        secure: false,
        auth: {
          user: configs.MAIL_USER_NAME,
          pass: configs.MAIL_PASSWORD,
        },
        debug: false,
        logger: true
      });
      const message = {
        from: configs.MAIL_USER_NAME,
        to: this.email,
        subject: "verify account",
        html: `<html>
                        <div>
                            <div>Welcome to The Ultimate News user the OTP code to verify access<div>
                            <div>here: ${this.token}</div>
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
        host: 'smtp.mail.yahoo.com',
        port: 465,
        service:'yahoo',
        secure: false,
        auth: {
          user: configs.MAIL_USER_NAME,
          pass: configs.MAIL_PASSWORD,
        },
        debug: false,
        logger: true
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
  static async sendMailingUpdate(email: string) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        service:'yahoo',
        secure: false,
        auth: {
          user: configs.MAIL_USER_NAME,
          pass: configs.MAIL_PASSWORD,
        },
        debug: false,
        logger: true
      });
      const data = {
        from: configs.MAIL_USER_NAME,
        to: 'socialmetre.za@gmail.com',
        subject: `Update Mailing list`,
        html: `<html>
                        <div>
                            <div>Update Mail List</div>
                            <div>
                              Email: ${email}
                            </div>
                        </div>
              </html>`,
      };
      await transporter.sendMail(data);
      return true
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  static async sendMailNotification(email: string, articles: DataFrame[]) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        service:'yahoo',
        secure: false,
        auth: {
          user: configs.MAIL_USER_NAME,
          pass: configs.MAIL_PASSWORD,
        },
        debug: false,
        logger: true
      });
      
      const html = await ejs.renderFile(path.join(__dirname, '../views/emails.ejs'), { data: articles }, {async: true});

      const data = {
        from: configs.MAIL_USER_NAME,
        to: email,
        subject: `The Ultimate News Digest`,
        html: html,
      };
      await transporter.sendMail(data);
      return true
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}

export default sendMail;
