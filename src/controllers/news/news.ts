import { Request, Response } from "express";
import newsService from "../../service/newsService";
import logger from "../../utils/logger";
import axios from "axios";
import { configs } from "../../configs/app.configs";
import { v4 } from "uuid";
import NewsSettings from "../../models/Mongodb/NewsSettings";
import insertIntoDB from "../../helpers/insertIntoDB";
import sentMailNotification from "../../helpers/sendMailNotification";
import sendPushNotification from "../../helpers/sendPushNotification";
import sendWebPushNotification from "../../helpers/sendWebPushNotification";
import urlBuilder from "../../helpers/urlBuilder";
import PushTokens from "../../models/Mongodb/PushTokens";
import UserModel from "../../models/Mongodb/Users";


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


const headlines = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    // @ts-ignore
    const id = request?.user?.id;

    let { page, size } = request.query as unknown as { page: number, size: number };

    if (!id) {
      return response.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (typeof page === 'undefined' || typeof size === 'undefined') {
      return response.status(400).json({
        success: false,
        message: "Page and Size needed",
      });
    }

    page = Number(page);
    size = Number(size);

    const data = await newsService.fetchNews(id, page, size);
    const latest = await newsService.latestNews();

    if (!data.success) {
      return response.status(400).json({
        success: false,
        data: 'Failed to get articles',
      });
    }
    return response.status(200).json({
      success: true,
      data: data,
      latest: latest.data,
    });
  } catch (error) {
    logger.error((error as Error).stack || error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

const search = async (request: Request, response: Response) => {
  try {
    const { term } = request.body;
    const newsResponse = await axios.get(
      `https://newsapi.org/v2/everything?q=+${term}&apiKey=${configs.NEW_ENDPOINT}`
    );
    if (newsResponse.status !== 200) {
      return response.status(400).json({
        success: false,
      });
    }
    return response.status(200).json({
      success: true,
      data: newsResponse.data.articles,
    });
  } catch (error) {
    logger.error((error as Error).stack || error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

const saveNews = async (
  userId: string
): Promise<{ success: boolean; data?: DataFormat[] }> => {
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
            "https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4",
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
        data: dateFormat,
      };
    }
    return {
      success: false,
    };
  } catch (error) {
    logger.error((error as Error).stack);
    return {
      success: false,
    };
  }
};

const fetchNews = async (request: Request, response: Response) => {
  try {
    const { KEY } = request.body
    if (KEY !== configs.CRON_KEY) {
      return response.status(400).json({
        success: false,
        message: 'Cron keys re not matching',
      })
    }
    const settings = await NewsSettings.find({});
    for (let i = 0; i < settings.length; i++) {
      if (settings[i].push_enabled || settings[i].email_notification) {
        const saved = await saveNews(settings[i].user_id);

        if (saved.success) {
          // Send Notification
          const token = await PushTokens.findOne({
            user_id: settings[i].user_id,
          }).exec();

          if (settings[i].push_enabled) {
            if (token) {
              await sendPushNotification(token.token, saved.data);
              logger.info("PUSH SENT ...");
            } else {
              logger.info("PUSH NOT SENT [TOKEN_NOT_FOUND] ...");
            }
          }
          const user = await UserModel.findOne({
            id: settings[i].user_id,
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
    return response.status(200).json({
      success: true,
      message: 'Successfully fetched news articles'
    })
  } catch (error) {
    logger.error((error as Error).stack || error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

export default {
  headlines,
  search,
  fetchNews
};
