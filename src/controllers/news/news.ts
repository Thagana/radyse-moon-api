import { Request, Response } from "express";
import fetchNews from "../../services/newsService";
import logger from "../../utils/logger";
import axios from "axios";
import { configs } from "../../configs/app.configs";

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

    const data = await fetchNews(id, page, size);
    
    if (!data.success) {
      return response.status(400).json({
        success: false,
        data: 'Failed to get articles',
      });
    }
    return response.status(200).json({
      success: true,
      data: data,
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

export default {
  headlines,
  search,
};
