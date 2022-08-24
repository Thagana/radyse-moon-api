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
exports.newsServiceFactory = void 0;
exports.newsServiceFactory = {
    init(repositories) {
        function headlines(id, page, size) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    let pageQuery = page;
                    let sizeQuery = size;
                    if (!pageQuery || !sizeQuery) {
                        pageQuery = 1;
                        sizeQuery = 10;
                    }
                    repositories.newsRepository.getHeadlineArticles()
                        .then((response) => {
                        resolve(response);
                    })
                        .catch((error) => reject(error));
                });
            });
        }
        function fetchNews(id, page, size) {
            return __awaiter(this, void 0, void 0, function* () {
                const settings = yield repositories.newsRepository.getSettings(id);
                const category = settings.category;
                const location = settings.location;
                const { limit, offset } = getPagination(page, size);
                const articles = yield repositories.newsRepository.getArticles(limit, offset, category, location);
                return articles;
            });
        }
        function getPagination(page, size) {
            const limit = size ? size : 10;
            const offset = page ? page * limit : 0;
            return { limit, offset };
        }
        function allNews(id, page, size) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let pageQuery = page;
                    let sizeQuery = size;
                    if (!pageQuery || !sizeQuery) {
                        pageQuery = 1;
                        sizeQuery = 10;
                    }
                    const news = yield fetchNews(id, pageQuery, sizeQuery);
                    return {
                        success: true,
                        data: news,
                    };
                }
                catch (error) {
                    return {
                        success: false,
                        error,
                    };
                }
            });
        }
        return {
            headlines,
            allNews,
        };
    },
};
