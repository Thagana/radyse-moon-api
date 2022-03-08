import logger from "../utils/logger";
import News from '../models/Mongodb/Articles';

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
}

const insertIntoDB = async (data: Articles[]): Promise<void> => {
    try {
        await News.insertMany(data);
    } catch (error) {
        logger.error((error as Error).stack || error);
    }
};

export default insertIntoDB;