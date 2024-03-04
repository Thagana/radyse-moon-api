import express, { Response, Request } from "express";
import { IServices } from "../../../interface/IService";
import { loginHandler, registerHandler, verifyHandler, forgotPasswordRequestHandler, forgotPasswordHandler } from "../route-handler/auth.handler";

const router = express.Router({ mergeParams: true });

export class AuthRouter {
  public static init(services: IServices) {
    router.post("/login", (request: Request, response: Response) =>
      loginHandler(services, request, response)
    );
    router.post('/register', (request: Request, response: Response) => {
      registerHandler(services, request, response);
    })
    router.post('/verify', (request: Request, response: Response) => {
      verifyHandler(services, request, response);
    })
    router.post('/forgot-password-request', (request: Request, response: Response) => {
      forgotPasswordRequestHandler(services, request, response);
    })
    router.post('/forgot-password', (request: Request, response: Response) => {
      forgotPasswordHandler(services, request, response);
    })
    return router;
  }
}
