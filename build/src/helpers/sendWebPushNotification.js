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
const web_push_1 = __importDefault(require("web-push"));
const logger_1 = __importDefault(require("../utils/logger"));
const app_configs_1 = require("../configs/app.configs");
function sendWebPushNotification(pushToken, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            web_push_1.default.setVapidDetails(app_configs_1.configs.WEB_PUSH_CONTACT, app_configs_1.configs.PUBLIC_VAPID_KEY, app_configs_1.configs.PRIVATE_VAPID_KEY);
            const token = pushToken;
            if (data) {
                for (const item of data) {
                    const payload = JSON.stringify({
                        icon: 'https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4',
                        image: item.urlToImage,
                        title: item.title,
                        body: item.description,
                    });
                    web_push_1.default
                        .sendNotification(token, payload)
                        .then()
                        .catch((e) => logger_1.default.error(e.stack));
                }
            }
            else {
                const payload = JSON.stringify({
                    title: 'News Fetched',
                    body: 'New news articles are fetched',
                });
                web_push_1.default
                    .sendNotification(token, payload)
                    .then()
                    .catch((e) => logger_1.default.error(e.stack));
            }
        }
        catch (error) {
            logger_1.default.error(error);
        }
    });
}
exports.default = sendWebPushNotification;
