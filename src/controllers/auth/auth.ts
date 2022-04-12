import { Request, Response } from "express";
import logger from "../../utils/logger";
import User from "../../models/Mongodb/Users";
import jwt from "jsonwebtoken";
import { configs } from "../../configs/app.configs";
import NewsSettings from "../../models/Mongodb/NewsSettings";
import Mail from '../../service/mailService';
import { v4 } from 'uuid';

const login = async (request: Request, response: Response): Promise<Response> => {
  try {
    const { token } = request.body;
    if (!token) {
      return response.status(400).json({
        success: false,
        message: "Token/Link required",
      });
    }

    const user = await User.findOne({
        token,
    }).exec();

    if (!user) {
      return response.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    // LOGIN
    const jwtToken = await jwt.sign(
      { id: user._id },
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

const tokenGenerator = () => {
    let val = ''
    for (let i = 0; i < 5; i += 1) {
      val += `${Math.round(Math.random() * 10)}`
    }
    return val
}

const register = async (request: Request, response: Response) => {
  try {
    const { email } = request.body;

    const user = await User.findOne({
      email,
    }).exec();
  const token = tokenGenerator()

  if (!user) {
    // CREATE AND LOGIN
    const newUser = await User.create(
      {
        first_name: "first_name",
        last_name: "last_name",
        email,
        avatar: "https://kulture-bucket.s3.af-south-1.amazonaws.com/68122202.jpeg",
        token: token,
    });

    await NewsSettings.create({
      user_id: newUser._id,
      language: 'en',
      location: 'ZA',
      frequency: 3,
      category: 'general',
      push_enabled: 0
    })
    const mailer = new Mail('User', email, token);
    const sendMail = await mailer.send();

    if (!sendMail) {
      return response.status(400).json()
    }
    return response.status(201).json({
      success: true,
      message: 'Successfully registered please check email',
    });
  }
  const mailer = new Mail('User', email, token);
  const sendMail = await mailer.send();

  if (!sendMail) {
    return response.status(400).json()
  }
  return response.status(200).json({
    success: true,
    message: 'Please check email',
  });
    
  } catch (error) {
    logger.error((error as Error).stack || error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export default { login, register };
