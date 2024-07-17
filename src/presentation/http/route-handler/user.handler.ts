import { Request, Response } from "express";
import { IServices } from "./../../../interface/IService";

export const settingsHandler = async (
  service: IServices,
  request: Request,
  response: Response
) => {
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
};

export const profileHandler = async (
  service: IServices,
  request: Request,
  response: Response
) => {
  try {
    return response.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong please try again later",
    })
  }
}
