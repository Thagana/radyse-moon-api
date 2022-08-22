import express, {  Request, Response} from 'express';
import { fetchNewsHandle, headlineHandler } from '../route-handler/news.handler';
import { IServices } from './../../../interface/IService';

const router = express.Router({ mergeParams: true });

export class NewsRoutes {
    public static init (service: IServices) {
        router.get("/headlines", (request: Request, response: Response) =>
        headlineHandler(service, request, response)
      );
      router.post("/fetch-news", (request: Request, response: Response) => fetchNewsHandle(service, request, response))
      return router;
    }
}