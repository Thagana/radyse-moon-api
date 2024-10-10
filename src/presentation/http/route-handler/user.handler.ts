import { Request, Response } from "express";
import { IServices } from "./../../../interface/IService";

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
