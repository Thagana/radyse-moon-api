import logger from "../utils/logger";
import News from '../data/infrastructure/db/entities/Articles';
import { v4 as uuidv4 } from 'uuid';
interface Articles {
    id: string;
    title: string;
    source: string;
    author: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    dateCreated: string;
    country: string;
    category: string;
    image: string;
    description: string;
    location: string;
}

const insertIntoDB = async (data: Articles[]): Promise<void> => {
    try {
        for (const item of data) {
            await News.create({
                id: item.id || uuidv4(),
                source: item.source,
                description: item.description,
                dateCreated: item.description,
                publishedAt: item.publishedAt,
                author: item.author,
                title: item.title,
                location: item.location,
                category: item.category,
                url: item.url,
                urlToImage: item.urlToImage,
                country: item.country
            });
        }
    } catch (error) {
        console.log(error);
    }
};

export default insertIntoDB;