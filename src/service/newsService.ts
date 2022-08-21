import logger from "../utils/logger";
import NewsSettings from "../models/Mongodb/NewsSettings";
import getNews from "../helpers/getNews";
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

const fetchNews = async (
  userId: string,
  page: number,
  size: number
): Promise<{
  success: boolean;
  data?: DataFormat[];
}> => {
  try {
    const settings = await NewsSettings.findOne({
      user_id: userId,
    }).exec();

    if (!settings) {
      return {
        success: false,
      };
    }
    const category = settings.category;
    const location = settings.location;

    const news = await getNews(category, location, page, size);

    if (!news.success) {
      return {
        success: false,
      };
    }
    return {
      success: true,
      data: news.data,
    };
  } catch (error) {
    logger.error((error as Error).stack || error);
    return {
      success: false,
    };
  }
};

const latestNews = async () => {
  try {
    const news = await ArticleModel.find({
      dateCreated: {
        $gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    })
      .sort({ dateCreated: -1 })
      .exec();

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
      country: item.country,
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

export default { fetchNews, latestNews };
