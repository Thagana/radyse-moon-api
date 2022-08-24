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
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../utils/logger"));
function sendPushNotification(expoPushToken, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (data) {
                for (const item of data) {
                    const message = {
                        to: expoPushToken,
                        sound: "default",
                        title: item.title,
                        body: item.description,
                    };
                    yield axios_1.default.post("https://exp.host/--/api/v2/push/send", message, {
                        headers: {
                            Accept: "application/json",
                            "Accept-encoding": "gzip, deflate",
                            "Content-Type": "application/json",
                        },
                    });
                }
            }
            else {
                const message = {
                    to: expoPushToken,
                    sound: "default",
                    title: "News Fetched",
                    body: "New News Articles have been fetched",
                };
                yield axios_1.default.post("https://exp.host/--/api/v2/push/send", message, {
                    headers: {
                        Accept: "application/json",
                        "Accept-encoding": "gzip, deflate",
                        "Content-Type": "application/json",
                    },
                });
            }
        }
        catch (error) {
            logger_1.default.error(error);
        }
    });
}
exports.default = sendPushNotification;
