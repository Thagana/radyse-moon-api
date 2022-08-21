import { News } from "../../../domain/news/news.model";
import ArticlesDOA from "../../infrastructure/db/entities/Articles";
import SettingsDOA from "../../infrastructure/db/entities/NewsSettings";
import { INewsRepository } from "../../../domain/news/news.repository";
import Article from "../../../interface/articles-interface";

export interface INewsRepositoryFactory {
  init(): INewsRepository;
}

export const newsServiceRepository: INewsRepositoryFactory = {
  init() {
    async function getSettings(userId: number) {
      return new Promise<{ category: string; location: string }>(
        (resolve, reject) => {
          SettingsDOA.findOne({
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
          const article = await ArticlesDOA.find({
            category: category,
            country: countryISO,
          })
            .sort({ dateCreated: -1 })
            .limit(limit)
            .skip(offset)
            .exec();

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
          console.log(mapper);
          resolve(mapper);
        } catch (error) {
          reject(error);
        }
      });
    }
    return {
      getArticles,
      getSettings,
    };
  },
};