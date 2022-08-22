import axios from 'axios';
import { v4 } from 'uuid';
import { configs } from "../../configs/app.configs";
import insertIntoDB from '../../helpers/insertIntoDB';
import Article from "../../interface/articles-interface";
import { IRepositories } from "../../interface/IRepository";
import logger from "../../utils/logger";

export interface INewsService {
  headlines(
    id: number,
  ): Promise<{
    success: boolean;
    message: string;
    data: Article[];
  }>;
  allNews(id: number, page: string, size: string): Promise<Article[]>;
  fetchArticles(KEY: string): Promise<{success: boolean, data: any[]}>;
}

export interface INewsServiceFactory {
  init(repositories: IRepositories): INewsService;
}

export const newsServiceFactory = {
  init(repositories: IRepositories): INewsService {
    async function headlines(id: number) {
      return new Promise<{
        success: boolean;
        message: string;
        data: Article[];
      }>((resolve, reject) => {
        fetchHeadlines(id)
          .then((response) => {
            resolve({
              success: true,
              message: "Successfully fetch news headlines",
              data: response,
            });
          })
          .catch((error) => reject(error));
      });
    }

    async function fetchHeadlines(id: number) {
      const settings = await repositories.newsRepository.getSettings(id);
      const category = settings.category;
      const location = settings.location;
      const articles = await repositories.newsRepository.getHeadlines(
        category,
        location
      );
      return articles; 
    }

    async function fetchNews(
      id: number,
      page: number,
      size: number
    ): Promise<Article[]> {
      const settings = await repositories.newsRepository.getSettings(id);
      const category = settings.category;
      const location = settings.location;
      const { limit, offset } = getPagination(page, size);
      const articles = await repositories.newsRepository.getArticles(
        limit,
        offset,
        category,
        location
      );
      return articles;
    }

    function getPagination(page: number, size: number) {
      const limit = size ? size : 10;
      const offset = page ? page * limit : 0;

      return { limit, offset };
    }

    async function allNews(id: number, page: string, size: string) {
      let pageQuery = page as unknown as number;
      let sizeQuery = size as unknown as number;
      if (!pageQuery || !sizeQuery) {
        pageQuery = 1;
        sizeQuery = 10;
      }
      const news = await fetchNews(id, pageQuery, sizeQuery);
      return news;
    }

    async function fetchArticles(KEY: string) {
      if (KEY !== configs.CRON_KEY) {
        return {
          success: false,
          data: []
        }
      }

      const locations = ['za', 'us', 'gb'];
      const categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
      
      const urls = urlBuilder(locations, categories);
      const request = await requestUrl(urls)
      await insertIntoDB(request.data);
      return request;
    }

    async function requestUrl(urls: string[]) {
      try {
        const promises = []
        for (let i = 0; i < urls.length; i++) {
          const promise = axios.get(urls[i]);
          promises.push(promise);
        }
        const results = await Promise.all(promises);
        const ArtD = [];
        for (let i = 0; i < results.length; i++) {
          const data = results[i].data;
          const articles = data.articles;
          const dataFormat: any[] = articles.map((item: any) => {
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
              country: "all",
              category: "category",
            };
          });
          ArtD.push(...dataFormat)
        }
        return {
          success: true,
          data: ArtD
        }
      } catch (error) {
        return {
          success: false,
          data: []
        }
      }
    }

    const urlBuilder = (locations: string[], categories: string[]) => {
      try {
          let urls = [];
          const placeholder = (l: string, c: string) => `https://newsapi.org/v2/top-headlines?country=${l}&category=${c}&apiKey=${configs.NEW_ENDPOINT}`;

          for (let i = 0; i < locations.length; i++) {
            for (let j  = i + 1; j < categories.length; j++) {
              urls.push(placeholder(locations[i], categories[j]))
            }
          }
          return urls
      } catch (error) {
          logger.error(error);
          return [''];
      }
  }

    return {
      headlines,
      allNews,
      fetchArticles
    };
  },
};
