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
exports.Mailer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const app_configs_1 = require("../../configs/app.configs");
class Mailer {
    constructor(username, email, token) {
        this.username = username;
        this.email = email;
        this.token = token;
    }
    static sendVerifyEmail(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const transporter = nodemailer_1.default.createTransport({
                    host: "smtp.mail.yahoo.com",
                    port: 465,
                    service: "yahoo",
                    secure: false,
                    auth: {
                        user: app_configs_1.configs.MAIL_USER_NAME,
                        pass: app_configs_1.configs.MAIL_PASSWORD,
                    },
                    debug: false,
                    logger: true,
                });
                const message = {
                    from: app_configs_1.configs.MAIL_USER_NAME,
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
        });
    }
}
exports.Mailer = Mailer;
