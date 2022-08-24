import express, {  Request, Response} from 'express';
import { allNewsHandler, headlineHandler } from '../route-handler/news.handler';
import { IServices } from './../../../interface/IService';

const router = express.Router({ mergeParams: true });

export class NewsRoutes {
    public static init (service: IServices) {
        router.get("/headlines", (request: Request, response: Response) =>
        headlineHandler(service, request, response)
      );
      router.get('/all-news', (request: Request, response: Response) => allNewsHandler(service, request, response))
      return router;
    }
}