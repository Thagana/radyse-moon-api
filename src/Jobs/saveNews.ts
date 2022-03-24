import logger from "../utils/logger";
import axios from "axios";
import { v4 } from "uuid";
import urlBuilder from "../helpers/urlBuilder";
import insertIntoDB from "../helpers/insertIntoDB";
import NewsSettings from "../models/Mongodb/NewsSettings";
import cron from 'node-cron';
import PushTokens from '../models/Mongodb/PushTokens';
import sendPushNotification from '../helpers/sendPushNotification';


interface ArticleResponse {
  source: {
    id: string | null;
    name: string;
  };
  title: string;
  author: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

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
  country: string;
  category: string;
}

const saveNews = async (userId: string): Promise<{ success: boolean }> => {
  try {
    const settings = await NewsSettings.findOne({
        user_id: userId,
    }).exec();

    if (!settings) {
      return {
        success: false,
      };
    }
    const location = settings.location;
    const category = settings.category;
    const builder = await urlBuilder(location, category);
    if (!builder.success) {
      return {
        success: false,
      };
    }
    const response = await axios.get(builder.url);
    if (response.status === 200) {
      const data = response.data;
      const articles: ArticleResponse[] = data.articles;
      const dateFormat: DataFormat[] = articles.map((item) => {
        return {
          id: v4(),
          title: item.title || "Unknown",
          source: item.source.name || "Unknown",
          author: item.author || "Unknown",
          url: item.url,
          urlToImage:
            item.urlToImage ||
            "https://kulture-bucket.s3.af-south-1.amazonaws.com/68122202.jpeg",
          publishedAt: item.publishedAt || "Unknown",
          description: item.description || "Not Available",
          dateCreated: new Date().toISOString(),
          country: location || "",
          category: category || "",
        };
      });

      await insertIntoDB(dateFormat);
      return {
        success: true,
      }
    }
    return {
      success: false
    }
  } catch (error) {
    logger.error((error as Error).stack);
    return {
      success: false
    }
  }
};

const saveNewsCron = cron.schedule('0 */6 * * *', async () => {
  const settings = await NewsSettings.find({
      push_enabled: 1
  });

  for (let i = 0; i < settings.length; i++) {
    const saved = await saveNews(settings[i].user_id);
    if (saved.success) {
      // Send Push Notification
      const token = await PushTokens.findOne({
          user_id: settings[i].user_id
      }).exec()
      
      if (token) {
        await sendPushNotification(token.token);
        logger.info('PUSH SENT ...');
      } else {
        logger.info('PUSH NOT SENT [TOKEN_NOT_FOUND] ...');
      }
    } else {
      logger.info('PUSH NOT SENT [FAILED_TO_SAVE]...');
    }
  }

})

export default saveNewsCron;
