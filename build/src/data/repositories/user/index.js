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
exports.userServiceRepository = void 0;
const User_1 = __importDefault(require("../../infrastructure/db/entities/User"));
const NewsSettings_1 = __importDefault(require("../../infrastructure/db/entities/NewsSettings"));
const UserMeta_1 = __importDefault(require("../../infrastructure/db/entities/UserMeta"));
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const Mailer_1 = require("../../../helpers/Mailer/Mailer");
exports.userServiceRepository = {
    init() {
        function createUser(email, token, headers) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        // CREATE USER
                        const user = yield User_1.default.create({
                            first_name: "first_name",
                            last_name: "last_name",
                            email,
                            avatar: "https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4",
                            token: token,
                        });
                        // CREATE NEWS SETTINGS
                        yield NewsSettings_1.default.create({
                            user_id: user.id,
                            language: "en",
                            location: "ZA",
                            frequency: 3,
                            category: "general",
                            push_enabled: 0,
                            email_notification: 0,
                            web_push_notification: 0,
                        });
                        // CREATE USER META
                        const UA = (0, ua_parser_js_1.default)(headers["user-agent"]);
                        const browserName = UA.browser.name || "X_AVAIL";
                        const browserVersion = UA.browser.version || "X_AVAIL";
                        const deviceModel = UA.device.model || "X_AVAIL";
                        const deviceVendor = UA.device.vendor || "X_AVAIL";
                        const deviceType = UA.device.type || "X_AVAIL";
                        const osName = UA.os.name || "X_AVAIL";
                        const osVersion = UA.os.version || "X_AVAIL";
                        const cpuArch = UA.cpu.architecture || "X_AVAIL";
                        const engine = UA.engine.name || "X_AVAIL";
                        yield UserMeta_1.default.create({
                            browser_name: browserName,
                            browser_version: browserVersion,
                            device_model: deviceModel,
                            device_vendor: deviceVendor,
                            device_type: deviceType,
                            os_name: osName,
                            os_version: osVersion,
                            cpu_architecture: cpuArch,
                            engine_name: engine,
                            user_id: user.id,
                        });
                        // SEND MAIL
                        const mailer = yield Mailer_1.Mailer.sendVerifyEmail(user.email, token);
                        if (!mailer) {
                            return {
                                success: false,
                                message: "Could not send mail",
                            };
                        }
                        return {
                            success: true,
                            message: "Successfully registered",
                        };
                    }
                    catch (error) {
                        console.log(error);
                        return {
                            success: false,
                            message: "Something went wrong please try again later",
                        };
                    }
                }));
            });
        }
        function findUser(email) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    User_1.default.findOne({
                        where: {
                            email,
                        },
                    })
                        .then((response) => {
                        if (response) {
                            resolve(response);
                        }
                        else {
                            resolve(false);
                        }
                    })
                        .catch((error) => reject(error));
                });
            });
        }
        function updateToken(token, user) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    User_1.default.update({
                        token: token,
                    }, {
                        where: {
                            id: user.id,
                        },
                    })
                        .then((response) => {
                        resolve(true);
                    })
                        .catch((error) => reject(error));
                });
            });
        }
        function getSettings(id) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    NewsSettings_1.default.findOne({
                        where: {
                            user_id: id,
                        },
                    })
                        .then((response) => {
                        if (response) {
                            resolve({
                                language: response.language,
                                location: response.location,
                                category: response.category,
                                frequency: response.frequency,
                                push_enabled: response.push_enabled,
                                email_notification: response.email_notification,
                                web_push_notification: response.web_push_notification,
                                sms_notification: response.sms_notification,
                            });
                        }
                    })
                        .catch((error) => reject(error));
                });
            });
        }
        return {
            updateToken,
            findUser,
            createUser,
            getSettings,
        };
    },
};
