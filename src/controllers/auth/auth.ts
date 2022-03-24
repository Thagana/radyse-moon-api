import { Request, Response } from "express";
import logger from "../../utils/logger";
import axios from "axios";
import User from "../../models/Mongodb/Users";
import jwt from "jsonwebtoken";
import { configs } from "../../configs/app.configs";
import NewsSettings from "../../models/Mongodb/NewsSettings";

const login = async (request: Request, response: Response): Promise<Response> => {
  try {
    const { token } = request.body;
    if (!token) {
      return response.status(400).json({
        success: false,
        message: "Token is missing from the request",
      });
    }
    const verify = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${token}`
    );

    if (verify.status !== 200) {
      return response.status(400).json({
        success: false,
        message: "Unable to verify token",
      });
    }

    const email = verify.data.email;

    const user = await User.findOne({
        email,
    }).exec();

    if (!user) {
      // CREATE AND LOGIN
      const newUser = await User.create(
        {
          first_name: "first_name",
          last_name: "last_name",
          email,
          avatar: "https://kulture-bucket.s3.af-south-1.amazonaws.com/68122202.jpeg",
        });
      const jwtToken = await jwt.sign(
        { id: newUser._id, googleToken: token },
        configs.TOKEN_SECRET
      );
      await NewsSettings.create({
        user_id: newUser._id,
        language: 'en',
        location: 'ZA',
        frequency: 3,
        category: 'general',
        push_enabled: 0
      })
      return response.status(201).json({
        success: true,
        data: jwtToken,
      });
    }

    // LOGIN
    const jwtToken = await jwt.sign(
      { id: user._id, googleToken: token },
      configs.TOKEN_SECRET
    );
    return response.status(200).json({
      success: true,
      data: jwtToken,
    });
  } catch (error) {
    logger.error((error as Error).stack || error);
    console.log(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default { login };
