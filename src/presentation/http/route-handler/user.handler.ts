import { Request, Response } from "express";
import { IServices } from "./../../../interface/IService";
export const settingsHandler = async (
  service: IServices,
  request: Request,
  response: Response
) => {
  try {
    // @ts-ignore
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

export const updateSettingsHandle = async (
  service: IServices,
  request: Request,
  response: Response
) => {
  try {
    // @ts-ignore
    const id = request?.auth?.id as number;
    const settings = request.body.settings
    const settingsUpdate = await service.userService.updateSettings(id, settings);
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
}
