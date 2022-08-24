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
exports.authServiceRepository = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_configs_1 = require("../../../configs/app.configs");
const User_1 = __importDefault(require("../../infrastructure/db/entities/User"));
const Mailer_1 = require("../../../helpers/Mailer/Mailer");
exports.authServiceRepository = {
    init() {
        function getJwtToken(user) {
            const jwtToken = jsonwebtoken_1.default.sign({ id: user.id }, app_configs_1.configs.TOKEN_SECRET);
            return jwtToken;
        }
        function getValidateCode(code) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    User_1.default.findOne({
                        where: {
                            token: code,
                        },
                    })
                        .then((user) => {
                        if (user) {
                            resolve(user);
                        }
                        resolve(false);
                    })
                        .catch((error) => reject(error));
                });
            });
        }
        function sendMail(username, email, token) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    Mailer_1.Mailer.sendVerifyEmail(email, token).then(results => {
                        if (results) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                    }).catch(error => reject(error));
                });
            });
        }
        function createUser(email) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    //
                });
            });
        }
        return {
            getJwtToken,
            getValidateCode,
            sendMail
        };
    },
};
