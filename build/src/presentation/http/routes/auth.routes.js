"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_handler_1 = require("../route-handler/auth.handler");
const router = express_1.default.Router({ mergeParams: true });
class AuthRouter {
    static init(services) {
        router.post("/login", (request, response) => (0, auth_handler_1.loginHandler)(services, request, response));
        router.post('/register', (request, response) => {
            (0, auth_handler_1.registerHandler)(services, request, response);
        });
        return router;
    }
}
exports.AuthRouter = AuthRouter;
