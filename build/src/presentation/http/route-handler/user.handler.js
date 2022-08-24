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
exports.settingsHandler = void 0;
const settingsHandler = (service, request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // @ts-ignore
        const id = (_a = request === null || request === void 0 ? void 0 : request.auth) === null || _a === void 0 ? void 0 : _a.id;
        const settings = yield service.userService.getSettings(id);
        return response.status(200).json({
            success: true,
            message: "",
            data: settings,
        });
    }
    catch (error) {
        console.log(error);
        return response.status(400).json({
            success: false,
            message: "Something went wrong please try again later",
        });
    }
});
exports.settingsHandler = settingsHandler;
