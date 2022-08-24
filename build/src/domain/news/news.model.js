"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.News = void 0;
class NewsResponse {
    constructor(id, title, source, author, url, urlToImage, dateCreated, category, description, publishedAt, country) {
        this.id = id;
        this.title = title;
        this.source = source;
        this.author = author;
        this.url = url;
        this.urlToImage = urlToImage;
        this.dateCreated = dateCreated;
        this.category = category;
        this.description = description;
        this.publishedAt = publishedAt;
        this.country = country;
    }
}
/**
 * This is the News model it is decoupled from the entities
 */
class News {
    constructor(id, title, source, author, url, urlToImage, dateCreated, category, description, publishedAt, country) {
        this.id = id;
        this.title = title;
        this.source = source;
        this.author = author;
        this.url = url;
        this.urlToImage = urlToImage;
        this.dateCreated = dateCreated;
        this.category = category;
        this.description = description;
        this.publishedAt = publishedAt;
        this.country = country;
    }
    response() {
        return new NewsResponse(this.id, this.title, this.source, this.author, this.url, this.urlToImage, this.dateCreated, this.category, this.description, this.publishedAt, this.country);
    }
}
exports.News = News;
