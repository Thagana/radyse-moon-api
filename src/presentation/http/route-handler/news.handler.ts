import { Request, Response } from "express";
import { IServices } from "../../../interface/IService";

export const headlineHandler = async (
  service: IServices,
  request: Request,
  response: Response
) => {
  try {
    // @ts-ignore 
    const id = request?.auth?.id as number;
    const news = await service.newsService.headlines(id);
    return response.status(200).json(news);
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong please try again later",
    });
  }
};

export const fetchNewsHandle = async (service: IServices, request: Request, response: Response) => {
  try {
    const fetched = await service.newsService.fetchArticles(request.body.KEY);
    return response.status(200).json(fetched);
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong please try again later",
    });
  }
}