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
exports.Database = void 0;
const sequelize_1 = require("sequelize");
const logger_1 = __importDefault(require("../../../utils/logger"));
class Database {
    constructor(DATABASE_URI) {
        this.DATABASE_URI = DATABASE_URI;
        this.sequelize = new sequelize_1.Sequelize(this.DATABASE_URI);
    }
    authenticate() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.sequelize) === null || _a === void 0 ? void 0 : _a.authenticate().then(() => {
                logger_1.default.info('Connected To The Database');
            }).catch(error => logger_1.default.error(error));
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.sequelize) {
                this.sequelize.close();
            }
        });
    }
}
exports.Database = Database;
