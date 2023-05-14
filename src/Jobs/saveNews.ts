import logger from "../utils/logger";
import axios from "axios";
import { v4 } from "uuid";
import urlBuilder from "../helpers/urlBuilder";
import insertIntoDB from "../helpers/insertIntoDB";
import NewsSettings from "../data/infrastructure/db/entities/NewsSettings";
import cron from "node-cron";
import PushTokens from "../data/infrastructure/db/entities/PushTokens";
import sendPushNotification from "../helpers/sendPushNotification";
import sentMailNotification from "../helpers/sendMailNotification";
import UserModel from "../data/infrastructure/db/entities/User";
import sendWebPushNotification from "../helpers/sendWebPushNotification";

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
  image: string;
  location: string;
}

const saveNews = async (
  userId: number
): Promise<{ success: boolean; data?: DataFormat[] }> => {
  try {
    const settings = await NewsSettings.findOne({
      where: {
        user_id: userId,
      }
    });

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
      const dateFormat: DataFormat[] = articles.map((item, index) => {
        return {
          id: v4(),
          title: item.title || "Unknown",
          source: item.source.name || "Unknown",
          author: item.author || "Unknown",
          url: item.url,
          urlToImage:
            item.urlToImage ||
            "https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4",
          publishedAt: item.publishedAt || "Unknown",
          description: item.description || "Not Available",
          dateCreated: new Date().toISOString(),
          country: location || "",
          category: category || "",
          image: item.urlToImage ||
          "https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4",
          location: location || "",
        };
      });

      await insertIntoDB(dateFormat);
      return {
        success: true,
        data: dateFormat,
      };
    }
    return {
      success: false,
    };
  } catch (error) {
    logger.error(error);
    return {
      success: false,
    };
  }
};

const saveNewsCron = cron.schedule("0 0 * * *", async () => {
  try {
    const settings = await NewsSettings.findAll();
    for (let i = 0; i < settings.length; i++) {
      if (settings[i].push_enabled || settings[i].email_notification) {
        const saved = await saveNews(settings[i].user_id);

        if (saved.success) {
          // Send Notification
          const token = await PushTokens.findOne({
            where: {
              user_id: settings[i].user_id,
            }
          })

          if (settings[i].push_enabled) {
            if (token) {
              await sendPushNotification(token.token, saved.data);
              logger.info("PUSH SENT ...");
            } else {
              logger.info("PUSH NOT SENT [TOKEN_NOT_FOUND] ...");
            }
          }
          const user = await UserModel.findOne({
            where: {
              id: settings[i].user_id,
            }
          });

          if (settings[i].email_notification) {
            if (user && saved.data) {
              await sentMailNotification(user.email, saved.data);
            } else {
              logger.error("EMAIL_NOTIFICATION_FAILED");
            }
          }
          if (settings[i].web_push_notification) {
            if (user && saved.data && token) {
                await sendWebPushNotification(token.token, saved.data)
            } else {
              logger.error("WEB_PUSH_NOTIFICATION_FAILED");
            }
          } 
        } else {
          logger.info("PUSH NOT SENT [FAILED_TO_SAVE]...");
        }
      }
    }
  } catch (error) {
    logger.error(error);
  }
});

export default saveNewsCron;
