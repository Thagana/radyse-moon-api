import Article from "../../interface/articles-interface";

export interface INewsRepository {
  getSettings(id: number): Promise<{
    location: string;
    category: string;
  }>;
  getArticles(
    limit: number,
    offset: number,
    category: string,
    countryISO: string
  ): Promise<Article[]>;
  getHeadlines(category: string, countryISO: string): Promise<Article[]>;
}
