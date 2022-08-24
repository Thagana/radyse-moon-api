"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const db_1 = require("./data/infrastructure/db");
const mongodb_1 = require("./data/infrastructure/db/mongodb");
const dotenv = __importStar(require("dotenv"));
const logger_1 = __importDefault(require("./utils/logger"));
const signals_1 = __importDefault(require("./signals"));
// DOMAIN -> BUSINESS LOGIC
const auth_service_1 = require("./domain/auth/auth.service");
const app_1 = require("./presentation/http/app");
const news_service_1 = require("./domain/news/news.service");
// REPOSITORY -> ADAPTOR TO FETCH RESOURCE FROM THE ENTITIES/MODEL/DATABASE
const auth_1 = require("./data/repositories/auth");
const user_1 = require("./data/repositories/user");
const news_1 = require("./data/repositories/news");
const user_service_1 = require("./domain/users/user.service");
dotenv.config({ path: "../.env" });
const db = new db_1.Database(process.env.DATABASE_URI || "");
const mongodb = new mongodb_1.Database(process.env.MONGO_DB_URI || "");
// INIT -> REPOSITORY
const authenticationRepository = auth_1.authServiceRepository.init();
const userRepository = user_1.userServiceRepository.init();
const newsRepository = news_1.newsServiceRepository.init();
const authService = auth_service_1.authServiceFactory.init({
    newsRepository,
    authenticationRepository,
    userRepository,
});
const newsService = news_service_1.newsServiceFactory.init({
    newsRepository,
    authenticationRepository,
    userRepository,
});
const userService = user_service_1.userServiceFactory.init({
    newsRepository,
    authenticationRepository,
    userRepository,
});
const app = app_1.appServerFactory.init({
    authService,
    newsService,
    userService
});
let server = app.listen(process.env.PORT, () => {
    logger_1.default.info(`Listening on *:${process.env.PORT}`);
});
const shutdown = signals_1.default.init(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db.close();
    yield mongodb.close();
    server.close();
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db.authenticate();
        yield mongodb.connect();
    }
    catch (error) {
        yield shutdown();
    }
}))();
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
