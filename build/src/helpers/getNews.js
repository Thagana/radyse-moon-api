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
const logger_1 = __importDefault(require("../utils/logger"));
const Articles_1 = __importDefault(require("../data/infrastructure/db/entities/Articles"));
const getPagination = (page, size) => {
    const limit = size ? size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};
const getNews = (category, country, page, size) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countryISO = country.toUpperCase();
        const { limit, offset } = getPagination(page, size);
        const news = yield Articles_1.default.find({
            category: category,
            country: countryISO,
        })
            .sort({ dateCreated: -1 })
            .limit(limit)
            .skip(offset)
            .exec();
        const mapper = news.map((item) => ({
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
        return {
            success: true,
            data: mapper,
        };
    }
    catch (error) {
        logger_1.default.error(error);
        return {
            success: false,
            data: [],
        };
    }
});
exports.default = getNews;
