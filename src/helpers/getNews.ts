import logger from "../utils/logger";
import ArticleModel from "../models/Mongodb/Articles";

interface DataFormat {
    id: string;
    title: string;
    source: string;
    author: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    description: string;
    dateCreated: string;
    category: string;
    country: string;
  }

const getNews = async (category: string, country: string) => {
  try {
    const countryISO = country.toUpperCase();
    const news = await ArticleModel.find({
      category: category,
      country: countryISO
    }).sort({ dateCreated: -1}).exec();

    const mapper: DataFormat[] = news.map((item) => ({
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
        country: item.country
    }));
    return {
      success: true,
      data: mapper,
    };
  } catch (error) {
    logger.error(error);
    return {
      success: false,
      data: [],
    };
  }
};

export default getNews;
