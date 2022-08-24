"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../utils/logger"));
const tokenRequired = (request, response, next) => {
    const authHeader = request.headers.authorization;
    const secret = process.env.TOKEN_SECRET || "";
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return response
            .status(401)
            .json({ success: false,
            message: 'Access denied to resource'
        });
    }
    jsonwebtoken_1.default.verify(token, secret, (err, user) => {
        if (err) {
            logger_1.default.error(err);
            return response
                .status(403)
                .json({ success: false, message: 'Access denied' });
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        request.user = user;
        return next();
    });
};
exports.default = tokenRequired;
