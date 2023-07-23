import { Request, Response } from "express";
import { IServices } from "./../../../interface/IService";

export const loginHandler = async (
  service: IServices,
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const { email, password } = request.body;
    const fcmtoken = request.headers['fcm_token'] as string;
    const loginResponse = await service.authService.login(email, password, fcmtoken);
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
    const { email, password, firstName, lastName } = request.body;
    const { headers } = request;
    const { success, token, message } = await service.authService.register(firstName, lastName, email, password, headers);
    if (!success) {
      return response.status(400).json({
        success: false,
        message: message,
      });
    }
    
    await service.notificationService.sendVerificationNotification(firstName, lastName, email, token);
    
    return response.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong please try again later",
    });
  }
};

export const verifyHandler = async (
  service: IServices,
  request: Request,
  response: Response
) => {
  try {
    const { token } = request.body;
    const verifyResponse = await service.authService.verify(token);
    if (!verifyResponse.success) {
      return response.status(400).json({
        success: false,
        message: verifyResponse.message,
      });
    }
    return response.status(200).json(verifyResponse);
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong please try again later",
    });
  }
}