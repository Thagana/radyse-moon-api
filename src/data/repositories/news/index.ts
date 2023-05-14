import Articles from "../../infrastructure/db/entities/Articles";
import Settings from "../../infrastructure/db/entities/NewsSettings";
import ArticlesDOA from "../../infrastructure/db/entities/Articles";
import SettingsDOA from "../../infrastructure/db/entities/NewsSettings";
import { INewsRepository } from "../../../domain/news/news.repository";
import Article from "../../../interface/articles-interface";
import moment from "moment-timezone";
export interface INewsRepositoryFactory {
  init(): INewsRepository;
}

export const newsServiceRepository: INewsRepositoryFactory = {
  init() {
    async function getSettings(userId: number) {
      return new Promise<{ category: string; location: string }>(
        (resolve, reject) => {
          Settings.findOne({
            where: {
              user_id: userId,
            },
          })
            .then((res) => {
              if (res) {
                resolve({
                  category: res.category,
                  location: res.location,
                });
              } else {
                resolve({
                  category: "General",
                  location: "ZA",
                });
              }
            })
            .catch((error) => reject(error));
        }
      );
    }
    async function getArticles(
      limit: number,
      offset: number,
      category: string,
      countryISO: string
    ) {
      return new Promise<Article[]>(async (resolve, reject) => {
        try {
          const article = await Articles.findAll({
            where: {
              category: category,
              country: countryISO,
            },
            limit: limit,
            offset: offset,
            order: [[ 'dateCreated', 'ASC' ]]
          })

          const mapper = article.map((item) => ({
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
          resolve(mapper);
        } catch (error) {
          reject(error);
        }
      });
    }
    async function getHeadlines(category: string, countryISO: string) {
      return new Promise<Article[]>(async (resolve, reject) => {
        try {
          const article = await Articles.findAll({
            where: {
              category: category,
              country: countryISO,
            },
            order: [[ 'dateCreated', 'ASC' ]],
          })

          const mapper = article.map((item) => ({
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
          resolve(mapper);
        } catch (error) {
          reject(error);
        }
      });
    }
    async function getHeadlineArticles() {
      return new Promise<Article[]>(async (resolve, reject) => {
        try {
          const article = await ArticlesDOA.findAll({
            order: [[ 'dateCreated', 'ASC' ]],
          })
          const mapper = article.map((item) => ({
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
          resolve(mapper);
        } catch (error) {
          reject(error);
        }
      });
    }
    return {
      getArticles,
      getSettings,
      getHeadlines,
      getHeadlineArticles,
    };
  },
};
