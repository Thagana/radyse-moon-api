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
exports.allNewsHandler = exports.headlineHandler = void 0;
const headlineHandler = (service, request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // @ts-ignore 
        const id = (_a = request === null || request === void 0 ? void 0 : request.auth) === null || _a === void 0 ? void 0 : _a.id;
        const { page, size } = request.query;
        const news = yield service.newsService.headlines(id, page, size);
        return response.status(200).json(news);
    }
    catch (error) {
        console.log(error);
        return response.status(400).json({
            success: false,
            message: "Something went wrong please try again later",
        });
    }
});
exports.headlineHandler = headlineHandler;
const allNewsHandler = (service, request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        // @ts-ignore 
        const id = (_b = request === null || request === void 0 ? void 0 : request.auth) === null || _b === void 0 ? void 0 : _b.id;
        const { page, size } = request.query;
        const news = yield service.newsService.allNews(id, page, size);
        if (!news.success) {
            return response.status(400).json({
                success: false,
                message: 'Something went wrong please try again later'
            });
        }
        return response.status(200).json(news);
    }
    catch (error) {
        console.log(error);
        return response.status(400).json({
            success: false,
            message: "Something went wrong please try again later",
        });
    }
});
exports.allNewsHandler = allNewsHandler;
