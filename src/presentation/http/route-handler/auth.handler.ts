import { Request, Response } from "express";
import { IServices } from "./../../../interface/IService";

export const loginHandler = async (
  service: IServices,
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const { code } = request.body;
    const fcmtoken = request.headers['fcm_token'] as string;
    const title = request.headers['fcm_title'] as string;
    const loginResponse = await service.authService.login(code, fcmtoken, title);
    if (!loginResponse.success) {
      return response.status(400).json(loginResponse);
    }
    return response.status(200).json(loginResponse);
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong please try again later",
    });
  }
};

export const registerHandler = async (
  service: IServices,
  request: Request,
  response: Response
) => {
  try {
    const { email } = request.body;
    const { headers } = request;
    const registerResponse = await service.authService.register(email, headers);
    if (!registerResponse.success) {
      return response.status(400).json({
        success: false,
        message: "Failed to register user",
      });
    }
    return response.status(200).json(registerResponse);
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong please try again later",
    });
  }
};
