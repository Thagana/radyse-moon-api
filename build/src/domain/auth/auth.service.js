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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServiceFactory = void 0;
exports.authServiceFactory = {
    init(repositories) {
        function register(email, headers) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = yield repositories.userRepository.findUser(email);
                    const rand = (min, max) => {
                        return Math.floor(Math.random() * (max - min + 1) + min);
                    };
                    const token = tokenGenerator(rand);
                    if (user) {
                        const sent = yield sendVerificationCode(user, token);
                        if (!sent.success) {
                            return {
                                success: false,
                                message: "Could not sent mail",
                            };
                        }
                        const updateToken = yield repositories.userRepository.updateToken(token, user);
                        if (!updateToken) {
                            return {
                                success: false,
                                message: "Failed to update token",
                            };
                        }
                        return {
                            success: true,
                            message: "Please check email, a verification code has been sent",
                        };
                    }
                    return repositories.userRepository.createUser(email, token, headers);
                }
                catch (error) {
                    console.log(error);
                    return {
                        success: false,
                        message: "Something went wrong, please try again later",
                    };
                }
            });
        }
        function tokenGenerator(rand) {
            let val = "";
            for (let i = 0; i < 5; i += 1) {
                val += `${rand(0, 10)}`;
            }
            return val;
        }
        function sendVerificationCode(user, token) {
            return __awaiter(this, void 0, void 0, function* () {
                const mailer = yield repositories.authenticationRepository.sendMail("NOT_UPDATED_USER", user.email, token);
                if (!mailer) {
                    return {
                        success: false,
                        message: "Failed to send mail",
                    };
                }
                return {
                    success: true,
                    message: "Please check email, for verification code",
                };
            });
        }
        function login(code) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    repositories.authenticationRepository
                        .getValidateCode(code)
                        .then((response) => {
                        if (!response) {
                            resolve({
                                success: false,
                                message: "User not found",
                            });
                        }
                        if (typeof response === "boolean") {
                            resolve({
                                success: false,
                                message: "Could not find user token",
                            });
                        }
                        const jwtToken = repositories.authenticationRepository.getJwtToken(response);
                        resolve({
                            success: true,
                            message: "Successfully logged in",
                            token: jwtToken,
                        });
                    })
                        .catch((error) => reject(error));
                });
            });
        }
        return {
            register,
            login,
        };
    },
};
