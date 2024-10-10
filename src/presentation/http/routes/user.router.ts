import express, { Response, Request } from "express";
import { IServices } from "../../../interface/IService";

const router = express.Router({ mergeParams: true });

export class UserRoutes {
  public static init(service: IServices) {
    router.get("/settings", async (request: Request, response: Response) => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const id = request?.auth?.id as number;
        const settings = await service.userService.getSettings(id);
        return response.status(200).json({
          success: true,
          message: "",
          data: settings,
        });
      } catch (error) {
        console.log(error);
        return response.status(400).json({
          success: false,
          message: "Something went wrong please try again later",
        });
      }
    });
    router.post("/push-token", (request: Request, response: Response) => {
      try {
        const { userId, token } = request.body;
        const updateToken = service.userService.savePushToken(token, userId);
        if (!updateToken) {
          return response.status(400).json({
            success: false,
            message: "Something went wrong please try again later",
          });
        }
        return response.status(200);
      } catch (error) {
        console.log(error);
        return response.status(400).json({
          success: false,
          message: "Something went wrong please try again later",
        });
      }
    });
    router.get("/profile", async (request: Request, response: Response) => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const id = request?.auth?.id as number;
        const profile = await service.userService.getProfile(id);
        if (!profile.success) {
          return response.status(400).json({
            success: false,
            message: "Something went wrong please try again later",
          });
        }
        return response.status(200).json({
          success: true,
          data: profile.data,
        });
      } catch (error) {
        console.log(error);
        return response.status(400).json({
          success: false,
          message: "Something went wrong please try again later",
        });
      }
    })
    return router;
  }
}
