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
exports.newsServiceRepository = void 0;
const Articles_1 = __importDefault(require("../../infrastructure/db/entities/Articles"));
const NewsSettings_1 = __importDefault(require("../../infrastructure/db/entities/NewsSettings"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
exports.newsServiceRepository = {
    init() {
        function getSettings(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    NewsSettings_1.default.findOne({
                        where: {
                            user_id: userId,
                        },
                    })
                        .then((res) => {
                        if (res) {
                            resolve({
                                category: res.category,
                                location: res.location,
                            });
                        }
                        else {
                            resolve({
                                category: "General",
                                location: "ZA",
                            });
                        }
                    })
                        .catch((error) => reject(error));
                });
            });
        }
        function getArticles(limit, offset, category, countryISO) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const article = yield Articles_1.default.find({
                            category: category,
                            country: countryISO,
                        })
                            .sort({ dateCreated: -1 })
                            .limit(limit)
                            .skip(offset)
                            .exec();
                        const mapper = article.map((item) => ({
                            id: item.id,
                            title: item.title,
                            source: item.source,
                            author: item.author,
                            url: item.url,
                            urlToImage: item.urlToImage,
                            dateCreated: item.dateCreated,
                            category: item.category,
                            description: item.description,
                            publishedAt: item.publishedAt,
                            country: item.country,
                        }));
                        resolve(mapper);
                    }
                    catch (error) {
                        reject(error);
                    }
                }));
            });
        }
        function getHeadlineArticles() {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const article = yield Articles_1.default.find({
                            dateCreated: {
                                $gt: (0, moment_timezone_1.default)(new Date(Date.now() - 24 * 60 * 60 * 1000)).toDate(),
                            },
                        })
                            .sort({ dateCreated: -1 })
                            .exec();
                        const mapper = article.map((item) => ({
                            id: item.id,
                            title: item.title,
                            source: item.source,
                            author: item.author,
                            url: item.url,
                            urlToImage: item.urlToImage,
                            dateCreated: item.dateCreated,
                            category: item.category,
                            description: item.description,
                            publishedAt: item.publishedAt,
                            country: item.country,
                        }));
                        resolve(mapper);
                    }
                    catch (error) {
                        reject(error);
                    }
                }));
            });
        }
        return {
            getArticles,
            getSettings,
            getHeadlineArticles,
        };
    },
};
