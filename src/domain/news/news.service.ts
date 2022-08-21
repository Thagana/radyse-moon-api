import Article from "../../interface/articles-interface";
import { IRepositories } from "../../interface/IRepository";

export interface INewsService {
  headlines(id: number, page: string, size: string): Promise<Article[]>;
  allNews(id: number, page: string, size: string): Promise<Article[]>;
}

export interface INewsServiceFactory {
  init(repositories: IRepositories): INewsService;
}

export const newsServiceFactory = {
  init(repositories: IRepositories): INewsService {
    async function headlines(id: number, page: string, size: string) {
      return new Promise<Article[]>((resolve, reject) => {
        let pageQuery = page as unknown as number;
        let sizeQuery = size as unknown as number;
        if (!pageQuery || !sizeQuery) {
          pageQuery = 1;
          sizeQuery = 10;
        }
        fetchNews(id, pageQuery, sizeQuery)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => reject(error));
      });
    }

    async function fetchNews(id: number, page: number, size: number): Promise<Article[]> {
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
    return {
      headlines,
      allNews,
    };
  },
};
