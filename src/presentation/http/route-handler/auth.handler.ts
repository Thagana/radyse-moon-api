import { Request, Response } from "express";
import { IServices } from "./../../../interface/IService";

export const loginHandler = async (
  service: IServices,
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const { code } = request.body;
    const loginResponse = await service.authService.login(code);
    if (!loginResponse.success) {
      return response.status(400).json(loginResponse);
    }
    return response.status(200).json(loginResponse);
  } catch (error) {
    console.log(error);
    return response.status(400).json({
        success: false,
        message: 'Something went wrong please try again later'
    })
  }
};
