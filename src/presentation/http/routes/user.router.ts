import { settingsHandler, updateSettingsHandle } from './../route-handler/user.handler';
import express, { Response, Router, Request } from "express";
import { IServices } from "../../../interface/IService";

const router = express.Router({ mergeParams: true });

export class UserRoutes {
  public static init(services: IServices) {
    router.get("/settings", (request: Request, response: Response) =>
      settingsHandler(services, request, response)
    );
    router.post('/settings',async (request: Request, response: Response) => {
      updateSettingsHandle(services, request, response);
    })
    return router;
  }
}
