"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    source: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    publishedAt: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    urlToImage: {
        type: String,
        required: true,
    }
});
const ArticleModel = (0, mongoose_1.model)('Article', schema);
exports.default = ArticleModel;
