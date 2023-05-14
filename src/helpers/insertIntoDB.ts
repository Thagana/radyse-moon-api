import logger from "../utils/logger";
import News from '../data/infrastructure/db/entities/Articles';

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
        await News.bulkCreate(data);
    } catch (error) {
        console.log(error);
        logger.error(error);
    }
};

export default insertIntoDB;