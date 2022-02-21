import { Request, Response } from "express";
import { configs } from "../../configs/app.configs";

import axios from "axios";
import logger from "../../utils/logger";

const fetchNews = async (country: string) => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${configs.NEW_ENDPOINT}`
    );
    if (response.status === 200) {
      const data = response.data;
      const articles = data.articles;
      return {
        success: true,
        data: articles,
      };
    }
    return {
      success: false,
    };
  } catch (error) {
    logger.error((error as Error).stack || error);
    return {
      success: false,
    };
  }
};

const headlines = async (request: Request, response: Response) => {
  try {
    const { countryISO } = request.body;
    let country = "";
    
    if (countryISO) {
      country = countryISO.toLowerCase();
    }

    if (!countryISO) {
      country = "za";
    }

    const data = await fetchNews(country);

    if (!data.success) {
      return response.status(400).json({
        success: false,
      });
    }
    return response.status(200).json({
      success: true,
      data: data.data,
    });
  } catch (error) {
    return response.status(400).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

export default {
  headlines,
};
