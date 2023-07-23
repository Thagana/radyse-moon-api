import Article from "../../interface/articles-interface";

export interface INewsRepository {
  getSettings(id: string): Promise<{
    location: string;
    category: string;
  }>;
  getArticles(
    limit: number,
    offset: number,
    category: string,
    countryISO: string
  ): Promise<Article[]>;
  /**
   * Retrieves a list of headlines for a given category and country.
   *
   * @param {string} category - The category to retrieve headlines for.
   * @param {string} countryISO - The ISO code of the country to retrieve headlines for.
   * @return {Promise<Article[]>} A promise that resolves to an array of Article objects.
   */
  getHeadlines(category: string, countryISO: string): Promise<Article[]>;
  /**
   * Retrieves a list of headline articles from a source and returns them as an array of Article objects.
   *
   * @return {Promise<Article[]>} A Promise that resolves to an array of Article objects representing the headline articles.
   */
  getHeadlineArticles(): Promise<Article[]>;
}
