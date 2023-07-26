import axios from "axios";
import { v4 } from "uuid";
import { configs } from "../../configs/app.configs";
import insertIntoDB from "../../helpers/insertIntoDB";
import Article from "../../interface/articles-interface";
import { IRepositories } from "../../interface/IRepository";

export interface INewsService {
  /**
   * Fetches articles from the server given a KEY.
   *
   * @param {string} KEY - The key to use to fetch the articles.
   * @return {Promise<{ success: boolean; data: any[] }>} - A promise that resolves to an object containing a success boolean and an array of data.
   */
  fetchArticles(KEY: string): Promise<{ success: boolean; data: any[] }>;
  /**
   * Retrieves headlines of articles based on the page and size provided.
   *
   * @param {number} id - The id of the article.
   * @param {string} page - The current page.
   * @param {string} size - The number of articles to be displayed per page.
   * @return {Promise<Article[]>} - A promise that resolves to an array of articles.
   */
  headlines(id: string, page: string, size: string): Promise<Article[]>;
  /**
   * Retrieves news articles from the server.
   *
   * @param {number} id - The ID of the news article to retrieve.
   * @param {string} page - The page of news articles to retrieve.
   * @param {string} size - The number of news articles per page to retrieve.
   * @return {Promise<{ success: boolean; data: Article[]; message?: undefined; } |
   *                  { success: boolean; error: unknown; }>} - A promise that resolves with an
   *                  object containing the fetched news articles on success and an error on
   *                  failure.
   */
  allNews(
    id: string,
    page: string,
    size: string
  ): Promise<
    | {
        success: boolean;
        data: Article[];
        message?: undefined;
      }
    | {
        success: boolean;
        error: unknown;
      }
  >;
}

export interface INewsServiceFactory {
  init(repositories: IRepositories): INewsService;
}

export const newsServiceFactory = {
  init(repositories: IRepositories): INewsService {
    /**
     * Asynchronously retrieves a list of headline articles.
     *
     * @param {number} id - The ID of the article.
     * @param {string} page - The page of the article.
     * @param {string} size - The size of the article.
     * @return {Promise<Article[]>} A promise that resolves to an array of Article objects.
     */
    async function headlines(id: string, page: string, size: string): Promise<Article[]> {
      return new Promise<Article[]>((resolve, reject) => {
        let pageQuery = page as unknown as number;
        let sizeQuery = size as unknown as number;
        if (!pageQuery || !sizeQuery) {
          pageQuery = 1;
          sizeQuery = 10;
        }
        repositories.newsRepository
          .getHeadlineArticles()
          .then((response) => {
            resolve(response);
          })
          .catch((error) => reject(error));
      });
    }

    async function fetchNews(
      id: string,
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

    async function allNews(id: string, page: string, size: string) {
      try {
        let pageQuery = page as unknown as number;
        let sizeQuery = size as unknown as number;
        if (!pageQuery || !sizeQuery) {
          pageQuery = 1;
          sizeQuery = 10;
        }
        const news = await fetchNews(id, pageQuery, sizeQuery);
        return {
          success: true,
          data: news,
        };
      } catch (error) {
        return {
          success: false,
          error,
        };
      }
    }

    async function fetchArticles(KEY: string) {
      if (KEY !== configs.CRON_KEY) {
        return {
          success: false,
          data: [],
        };
      }

      const locations = ["za", "us", "gb"];
      const categories = ["general"];

      const urls = urlBuilder(locations, categories);
      const request = await requestUrl(urls);
      await insertIntoDB(request.data);
      return request;
    }

    async function requestUrl(urls: string[]) {
      try {
        const promises = [];

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
          ArtD.push(...dataFormat);
        }
        return {
          success: true,
          data: ArtD,
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: [],
        };
      }
    }

    const urlBuilder = (locations: string[], categories: string[]) => {
      try {
        let urls: string[] = [];
        locations.forEach((l) => {
          categories.forEach((c) => {
            const link = `https://newsapi.org/v2/top-headlines?country=${l}&category=${c}&apiKey=${configs.NEW_ENDPOINT}`;
            urls.push(link);
          });
        });

        return urls;
      } catch (error) {
        console.error(error);
        return [""];
      }
    };

    return {
      headlines,
      allNews,
      fetchArticles,
    };
  },
};
