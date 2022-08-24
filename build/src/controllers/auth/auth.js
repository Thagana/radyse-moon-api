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
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../../utils/logger"));
const Users_1 = __importDefault(require("../../data/infrastructure/db/entities/Mongodb/Users"));
const app_configs_1 = require("../../configs/app.configs");
const NewsSettings_1 = __importDefault(require("../../data/infrastructure/db/entities/Mongodb/NewsSettings"));
const mailService_1 = __importDefault(require("../../services/mailService"));
const tokenGenerator_1 = __importDefault(require("../../helpers/tokenGenerator"));
const UserMeta_1 = __importDefault(require("../../data/infrastructure/db/entities/Mongodb/UserMeta"));
const PushTokens_1 = __importDefault(require("../../models/Mongodb/PushTokens"));
const login = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, token } = request.body;
        if (!code) {
            return response.status(400).json({
                success: false,
                message: "Token/Link required",
            });
        }
        const user = yield Users_1.default.findOne({
            token: code,
        });
        if (!user) {
            return response.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        if (token) {
            yield PushTokens_1.default.updateOne({
                user_id: user._id
            }, {
                token: token
            });
        }
        // LOGIN
        const jwtToken = yield jsonwebtoken_1.default.sign({ id: user._id }, app_configs_1.configs.TOKEN_SECRET);
        return response.status(200).json({
            success: true,
            token: jwtToken,
        });
    }
    catch (error) {
        logger_1.default.error(error.stack || error);
        return response.status(400).json({
            success: false,
            message: "Something went wrong",
        });
    }
});
const register = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = request.body;
        const user = yield Users_1.default.findOne({
            email,
        }).exec();
        const UA = (0, ua_parser_js_1.default)(request.headers["user-agent"]);
        const token = (0, tokenGenerator_1.default)();
        if (!user) {
            // CREATE AND LOGIN
            const newUser = yield Users_1.default.create({
                first_name: "first_name",
                last_name: "last_name",
                email,
                avatar: "https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4",
                token: token,
            });
            yield NewsSettings_1.default.create({
                user_id: newUser._id,
                language: "en",
                location: "ZA",
                frequency: 3,
                category: "general",
                push_enabled: 0,
                email_notification: 0,
                web_push_notification: 0,
            });
            const browserName = UA.browser.name || 'X_AVAIL';
            const browserVersion = UA.browser.version || 'X_AVAIL';
            const deviceModel = UA.device.model || 'X_AVAIL';
            const deviceVendor = UA.device.vendor || 'X_AVAIL';
            const deviceType = UA.device.type || 'X_AVAIL';
            const osName = UA.os.name || 'X_AVAIL';
            const osVersion = UA.os.version || 'X_AVAIL';
            const cpuArch = UA.cpu.architecture || 'X_AVAIL';
            const engine = UA.engine.name || 'X_AVAIL';
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
                user_id: newUser._id
            });
            const mailer = new mailService_1.default("User", email, token);
            const sendMail = yield mailer.send();
            if (!sendMail) {
                return response.status(400).json();
            }
            return response.status(200).json({
                success: true,
                message: "Successfully registered please check email",
            });
        }
        const mailer = new mailService_1.default("User", email, token);
        const sendMail = yield mailer.send();
        if (!sendMail) {
            return response.status(400).json({
                success: false,
                message: "Something went wrong please try again later",
            });
        }
        yield Users_1.default.findOneAndUpdate({
            _id: user._id,
        }, {
            token: token,
        });
        return response.status(200).json({
            success: true,
            message: "Please check email",
        });
    }
    catch (error) {
        logger_1.default.error(error.stack || error);
        return response.status(400).json({
            success: false,
            message: "Something went wrong",
        });
    }
});
const verifyToken = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = request.body;
        if (!token) {
            return response.status(400).json({
                success: false,
                message: "Not token found",
            });
        }
        const secret = process.env.TOKEN_SECRET || "";
        let access = true;
        jsonwebtoken_1.default.verify(token, secret, (error, user) => {
            if (error) {
                logger_1.default.error(error.stack || error);
                access = false;
            }
        });
        if (!access) {
            return response
                .status(403)
                .json({ success: false, message: "Access denied" });
        }
        return response.status(200).json({ success: true });
    }
    catch (error) {
        logger_1.default.error(error.stack || error);
        return response.status(400).json({
            success: false,
            message: "Something went wrong",
        });
    }
});
exports.default = { login, register, verifyToken };
