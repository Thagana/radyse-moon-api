"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prodLogger_1 = __importDefault(require("./prodLogger"));
const devLogger_1 = __importDefault(require("./devLogger"));
const logger = process.env.NODE_ENV === 'production' ? prodLogger_1.default : devLogger_1.default;
exports.default = logger();
