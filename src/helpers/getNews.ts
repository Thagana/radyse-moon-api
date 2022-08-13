import logger from "../utils/logger";
import ArticleModel from "../data/infrastructure/db/entities/Articles";

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
  category: string;
  country: string;
}

const getPagination = (page: number, size: number) => {
  const limit = size ? size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getNews = async (
  category: string,
  country: string,
  page: number,
  size: number
) => {
  try {
    const countryISO = country.toUpperCase();

    const { limit, offset } = getPagination(page, size);

    const news = await ArticleModel.find({
      category: category,
      country: countryISO,
    })
      .sort({ dateCreated: -1 })
      .limit(limit)
      .skip(offset)
      .exec();

    const mapper: DataFormat[] = news.map((item) => ({
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
    return {
      success: true,
      data: mapper,
    };
  } catch (error) {
    logger.error(error);
    return {
      success: false,
      data: [],
    };
  }
};

export default getNews;
