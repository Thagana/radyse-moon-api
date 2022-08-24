"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const user_handler_1 = require("./../route-handler/user.handler");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router({ mergeParams: true });
class UserRoutes {
    static init(services) {
        router.get("/settings", (request, response) => (0, user_handler_1.settingsHandler)(services, request, response));
        return router;
    }
}
exports.UserRoutes = UserRoutes;
