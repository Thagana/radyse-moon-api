import { settingsHandler } from './../route-handler/user.handler';
import express, { Response, Request } from "express";
import { IServices } from "../../../interface/IService";

const router = express.Router({ mergeParams: true });

export class UserRoutes {
  public static init(services: IServices) {
    router.get("/settings", (request: Request, response: Response) =>
      settingsHandler(services, request, response)
    );
    return router;
  }
}
