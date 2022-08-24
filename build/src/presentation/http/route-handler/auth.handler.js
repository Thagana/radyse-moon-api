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
exports.registerHandler = exports.loginHandler = void 0;
const loginHandler = (service, request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = request.body;
        const loginResponse = yield service.authService.login(code);
        if (!loginResponse.success) {
            return response.status(400).json(loginResponse);
        }
        return response.status(200).json(loginResponse);
    }
    catch (error) {
        console.log(error);
        return response.status(400).json({
            success: false,
            message: "Something went wrong please try again later",
        });
    }
});
exports.loginHandler = loginHandler;
const registerHandler = (service, request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = request.body;
        const { headers } = request;
        const registerResponse = yield service.authService.register(email, headers);
        if (!registerResponse.success) {
            return response.status(400).json({
                success: false,
                message: "Failed to register user",
            });
        }
        return response.status(200).json(registerResponse);
    }
    catch (error) {
        console.log(error);
        return response.status(400).json({
            success: false,
            message: "Something went wrong please try again later",
        });
    }
});
exports.registerHandler = registerHandler;
