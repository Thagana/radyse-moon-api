import { Request, Response } from "express";
import fetchNews from "../../service/newsService";
import logger from "../../utils/logger";
import validate from '../../helpers/validateCategory';

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

export default {
  headlines,
};
