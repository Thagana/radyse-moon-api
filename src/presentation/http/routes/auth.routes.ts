import express, { Response, Router, Request } from "express";
import { IServices } from "../../../interface/IService";
import { loginHandler, registerHandler } from "../route-handler/auth.handler";

const router = express.Router({ mergeParams: true });

export class AuthRouter {
  public static init(services: IServices) {
    router.post("/login", (request: Request, response: Response) =>
      loginHandler(services, request, response)
    );
    router.post('/register', (request: Request, response: Response) => {
      registerHandler(services, request, response);
    })
    return router;
  }
}