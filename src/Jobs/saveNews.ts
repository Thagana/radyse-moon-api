import logger from "../utils/logger";
import axios from "axios";
import { v4 } from "uuid";
import urlBuilder from "../helpers/urlBuilder";
import insertIntoDB from "../helpers/insertIntoDB";
import NewsSettings from "../models/SQL/NewsSettings";
import cron from 'node-cron';

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

const saveNews = async (userId: number) => {
  try {
    const settings = await NewsSettings.findOne({
      where: {
        user_id: userId,
      },
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
    }
  } catch (error) {
    logger.error(error);
  }
};

const saveNewsCron = cron.schedule('0 */6 * * *', async () => {
  const users = await NewsSettings.findAll({
    where: {
      push_enabled: 1
    }
  });
  const results = [];
  for (let i = 0; i < users.length; i++) {
    const saved = saveNews(users[i].user_id);
    results.push(saved);
  }

  const data = await Promise.all(results);
  // TODO: send push notification with fetch news results
  console.log('Cron run with all these results', data);
})

export default saveNewsCron;
