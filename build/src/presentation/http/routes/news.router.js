"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const news_handler_1 = require("../route-handler/news.handler");
const router = express_1.default.Router({ mergeParams: true });
class NewsRoutes {
    static init(service) {
        router.get("/headlines", (request, response) => (0, news_handler_1.headlineHandler)(service, request, response));
        router.get('/all-news', (request, response) => (0, news_handler_1.allNewsHandler)(service, request, response));
        return router;
    }
}
exports.NewsRoutes = NewsRoutes;
