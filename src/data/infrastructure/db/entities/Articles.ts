import { Schema, model } from 'mongoose';

export interface Article {
    source: string;
    image: string;
    description: string;
    dateCreated: string;
    publishedAt: string;
    author: string;
    title: string;
    location: string;
    category: string;
    url: string;
    urlToImage: string;
    country: string;
}

const schema: Schema = new Schema<Article>({
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

const ArticleModel = model<Article>('Article', schema);

export default ArticleModel;