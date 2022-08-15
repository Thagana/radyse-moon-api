import { Request, Response } from "express";
import parser from "ua-parser-js";
import jwt from "jsonwebtoken";
import logger from "../../utils/logger";
import User from "../../models/Mongodb/Users";
import { configs } from "../../configs/app.configs";
import NewsSettings from "../../models/Mongodb/NewsSettings";
import Mail from "../../service/mailService";
import tokenGenerator from "../../helpers/tokenGenerator";
import UserMeta from "../../models/Mongodb/UserMeta";
import PushToken from "../../models/Mongodb/PushTokens";

const login = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const { code, token } = request.body;
    if (!code) {
      return response.status(400).json({
        success: false,
        message: "Token/Link required",
      });
    }

    const user = await User.findOne({
      token: code,
    });

    if (!user) {
      return response.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    
    if (token) {
        await PushToken.updateOne({
          user_id: user._id
        }, {
          token: token
        });
    }

    // LOGIN
    const jwtToken = await jwt.sign({ id: user._id }, configs.TOKEN_SECRET);
    
    return response.status(200).json({
      success: true,
      token: jwtToken,
    });
  } catch (error) {
    logger.error((error as Error).stack || error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const register = async (request: Request, response: Response) => {
  try {
    const { email } = request.body;

    const user = await User.findOne({
      email,
    }).exec();

    const UA = parser(request.headers["user-agent"]);

    const token = tokenGenerator();

    if (!user) {
      // CREATE AND LOGIN
      const newUser = await User.create({
        first_name: "first_name",
        last_name: "last_name",
        email,
        avatar:
          "https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4",
        token: token,
      });

      await NewsSettings.create({
        user_id: newUser._id,
        language: "en",
        location: "ZA",
        frequency: 3,
        category: "general",
        push_enabled: 0,
        email_notification: 0,
        web_push_notification: 0,
      });

      const browserName = UA.browser.name || 'X_AVAIL';
      const browserVersion = UA.browser.version || 'X_AVAIL';
      const deviceModel = UA.device.model || 'X_AVAIL';
      const deviceVendor = UA.device.vendor || 'X_AVAIL';
      const deviceType = UA.device.type || 'X_AVAIL';
      const osName = UA.os.name || 'X_AVAIL';
      const osVersion = UA.os.version || 'X_AVAIL';
      const cpuArch = UA.cpu.architecture || 'X_AVAIL';
      const engine = UA.engine.name || 'X_AVAIL'

      await UserMeta.create({
        browser_name: browserName,
        browser_version: browserVersion,
        device_model: deviceModel,
        device_vendor: deviceVendor,
        device_type: deviceType,
        os_name: osName,
        os_version: osVersion,
        cpu_architecture: cpuArch,
        engine_name: engine,
        user_id: newUser._id
      });

      const mailer = new Mail("User", email, token);
      const sendMail = await mailer.send();

      if (!sendMail) {
        return response.status(400).json();
      }
      return response.status(200).json({
        success: true,
        message: "Successfully registered please check email",
      });
    }
    const mailer = new Mail("User", email, token);
    const sendMail = await mailer.send();

    if (!sendMail) {
      return response.status(400).json({
        success: false,
        message: "Something went wrong please try again later",
      });
    }

    await User.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        token: token,
      }
    );

    return response.status(200).json({
      success: true,
      message: "Please check email",
    });
  } catch (error) {
    logger.error((error as Error).stack || error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const verifyToken = async (request: Request, response: Response) => {
  try {
    const { token } = request.body;
    if (!token) {
      return response.status(400).json({
        success: false,
        message: "Not token found",
      });
    }
    const secret: string = process.env.TOKEN_SECRET || "";
    let access = true;

    jwt.verify(token, secret, (error: any, user: any) => {
      if (error) {
        logger.error((error as Error).stack || error);
        access = false;
      }
    });

    if (!access) {
      return response
        .status(403)
        .json({ success: false, message: "Access denied" });
    }

    return response.status(200).json({ success: true });
  } catch (error) {
    logger.error((error as Error).stack || error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default { login, register, verifyToken };
