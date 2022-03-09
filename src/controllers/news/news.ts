import { Request, Response } from "express";
import fetchNews from "../../service/newsService";
import logger from "../../utils/logger";
import validate from '../../helpers/validateCategory';
import axios from 'axios';
import { configs } from "../../configs/app.configs";
const headlines = async (request: Request | any, response: Response): Promise<Response> => {
  try {
    const id = request?.user?.id
    
    if (!id) {
      return response.status(400).json({
        success: false,
        message: 'Unauthorized'
      })
    }
 
    const data = await fetchNews(id);

    if (!data.success) {
      return response.status(400).json({
        success: false,
        data: data.data
      });
    }
    return response.status(200).json({
      success: true,
      data: data
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
    const newsResponse = await axios.get(`https://newsapi.org/v2/everything?q=+${term}&apiKey=${configs.NEW_ENDPOINT}`);
    if (newsResponse.status !== 200) {
      return response.status(400).json({
        success: false
      })
    }
    return response.status(200).json({
      success: true,
      data: newsResponse.data.articles
    })
  } catch (error) {
    logger.error((error as Error).stack || error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
}

export default {
  headlines,
  search
};
