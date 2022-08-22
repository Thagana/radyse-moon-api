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
    const {  page, size } = request.query as unknown as {  page: string, size: string};
    const news = await service.newsService.headlines(id, page, size);
    return response.status(200).json(news);
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong please try again later",
    });
  }
};


export const allNewsHandler = async (service: IServices, request: Request, response: Response) => {
  try {
      // @ts-ignore 
      const id = request?.auth?.id as number;
      const {  page, size } = request.query as unknown as {  page: string, size: string};
      const news = await service.newsService.allNews(id, page, size);
      if (!news.success) {
        return response.status(400).json({
          success: false,
          message: 'Something went wrong please try again later'
        })
      }
      return response.status(200).json(news);
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong please try again later",
    });
  }
}