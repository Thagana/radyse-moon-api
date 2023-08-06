import { Request, Response } from "express";
import { IServices } from "../../../interface/IService";

export const headlineHandler = async (
  service: IServices,
  request: Request,
  response: Response
) => {
  try {
    // @ts-ignore 
    const id = request?.user?.user_id as string;
    const page = request.query.page as string;
    const size = request.query.size as string;
    const news = await service.newsService.headlines(id, page, size);
    return response.status(200).json({ success: true, data: news });
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
      const id = request?.user?.user_id as number;
      const {  page, size } = request.query as unknown as {  page: string, size: string};
      const news = await service.newsService.allNews(id, page, size);
      return response.status(200).json(news);
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong please try again later",
    });
  }
}

export const fetchNewsHandle = async (service: IServices, request: Request, response: Response) => {
  try {
    const key = request.query['KEY'] as string;
    const fetched = await service.newsService.fetchArticles(key);
    await service.notificationService.sendCronFetchedArticlesNotification(fetched.data);
    return response.status(200).json(fetched);
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong please try again later",
    });
  }
}