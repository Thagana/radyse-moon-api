import logger from "../utils/logger";
import NewsSettings from '../models/Mongodb/NewsSettings';
import getNews from "../helpers/getNews";


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

const fetchNews = async (userId: string): Promise<{
  success: boolean;
  data?: DataFormat[];
}> => {
  try {
    const settings = await NewsSettings.findOne({
        user_id: userId
    }).exec();
    
    if (!settings) {
      return {
        success: false
      }
    }
    const category = settings.category;
    const location = settings.location;

    const news = await getNews(category, location);
    
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

export default fetchNews;
