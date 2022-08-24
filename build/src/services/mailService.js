"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("../utils/logger"));
const app_configs_1 = require("../configs/app.configs");
const logger_2 = __importDefault(require("../utils/logger"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
class sendMail {
    constructor(username, email, token) {
        this.username = username;
        this.email = email;
        this.token = token;
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = nodemailer_1.default.createTransport({
                    host: 'smtp.mail.yahoo.com',
                    port: 465,
                    service: 'yahoo',
                    secure: false,
                    auth: {
                        user: app_configs_1.configs.MAIL_USER_NAME,
                        pass: app_configs_1.configs.MAIL_PASSWORD,
                    },
                    debug: false,
                    logger: true
                });
                const message = {
                    from: app_configs_1.configs.MAIL_USER_NAME,
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
                yield transporter.sendMail(message);
                return true;
            }
            catch (error) {
                logger_1.default.error(error);
                return false;
            }
        });
    }
    static sendContactInformation(email, name, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = nodemailer_1.default.createTransport({
                    host: 'smtp.mail.yahoo.com',
                    port: 465,
                    service: 'yahoo',
                    secure: false,
                    auth: {
                        user: app_configs_1.configs.MAIL_USER_NAME,
                        pass: app_configs_1.configs.MAIL_PASSWORD,
                    },
                    debug: false,
                    logger: true
                });
                const data = {
                    from: app_configs_1.configs.MAIL_USER_NAME,
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
                yield transporter.sendMail(data);
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    static sendMailingUpdate(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = nodemailer_1.default.createTransport({
                    host: 'smtp.mail.yahoo.com',
                    port: 465,
                    service: 'yahoo',
                    secure: false,
                    auth: {
                        user: app_configs_1.configs.MAIL_USER_NAME,
                        pass: app_configs_1.configs.MAIL_PASSWORD,
                    },
                    debug: false,
                    logger: true
                });
                const data = {
                    from: app_configs_1.configs.MAIL_USER_NAME,
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
                yield transporter.sendMail(data);
                return true;
            }
            catch (error) {
                logger_2.default.error(error);
                return false;
            }
        });
    }
    static sendMailNotification(email, articles) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = nodemailer_1.default.createTransport({
                    host: 'smtp.mail.yahoo.com',
                    port: 465,
                    service: 'yahoo',
                    secure: false,
                    auth: {
                        user: app_configs_1.configs.MAIL_USER_NAME,
                        pass: app_configs_1.configs.MAIL_PASSWORD,
                    },
                    debug: false,
                    logger: true
                });
                const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, '../views/emails.ejs'), { data: articles }, { async: true });
                const data = {
                    from: app_configs_1.configs.MAIL_USER_NAME,
                    to: email,
                    subject: `The Ultimate News Digest`,
                    html: html,
                };
                yield transporter.sendMail(data);
                return true;
            }
            catch (error) {
                logger_2.default.error(error);
                return false;
            }
        });
    }
}
exports.default = sendMail;
