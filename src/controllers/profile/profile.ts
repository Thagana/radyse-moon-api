import { Request, Response } from "express";
import NewsSettings from "../../models/Mongodb/NewsSettings";
import WeatherLocation from "../../models/Mongodb/WeatherLocation";
import fetchWeather from "../../Jobs/fetchWeather";
import logger from "../../utils/logger";
import Tokens from "../../models/Mongodb/PushTokens";
import UserModel from "../../models/Mongodb/Users";
import updateUserDetails from '../../helpers/updateUserDetails';
import updateEmailNotification from '../../helpers/updateEmailNotification';


const pushNotificationService = async (userId: string, token: string) => {
  try {
    const tokens = await Tokens.findOne({
        user_id: userId,
    }).exec();

    if (!tokens) {
      await Tokens.create({
        user_id: userId,
        token: token,
      });
    }
    await Tokens.findOneAndUpdate({ token: token }, { user_id: userId });
    await NewsSettings.findOneAndUpdate({ push_enabled: 1 }, { user_id: userId });

  } catch (error) {
    logger.error(error);
  }
};

const getSettings = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    // @ts-ignore
    const id = request?.user?.id;
    if (!id) {
      return response.status(400).json({
        success: false,
        message: "Access denied",
      });
    }
    const userId = id;

    const settings = await NewsSettings.findOne({
        user_id: userId,
    }).exec();

    if (!settings) {
      return response.status(200).json({
        success: false,
        message: "could not find settings",
      });
    }
    const user = await UserModel.findOne({
      id: userId
    })
    return response.status(200).json({
      success: true,
      data: {
        location: settings.location,
        language: settings.language,
        frequency: settings.frequency,
        pushState: settings.push_enabled,
        name: user?.first_name + ' ' + user?.last_name,
        email_notification: settings.email_notification
      },
    });
  } catch (error) {
    logger.error((error as Error).stack || error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

const userWeather = async (request: Request | any, response: Response) => {
  try {
    const id = request?.user?.id;
    if (!id) {
      return response.status(400).json({
        success: false,
        message: "CANNOT_LOAD_LOCATION",
      });
    }
    const userId = Number(id);
    const weather = await WeatherLocation.findOne({
        user_id: userId,
    }).exec();
    if (!weather) {
      return response.status(200).json({
        success: false,
        message: "LOCATION_NOT_SET",
      });
    }
    const weatherFetch = await fetchWeather(
      weather.latitude,
      weather.longitude
    );
    if (!weatherFetch) {
      return response.status(200).json({
        success: false,
        message: "CANNOT_LOAD_LOCATION",
      });
    }
    return response.status(200).json({
      success: true,
      data: weatherFetch,
    });
  } catch (error) {
    logger.error((error as Error).stack || error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

const setUserLocation = async (
  request: Request | any,
  response: Response
): Promise<Response> => {
  try {
    const id = request?.user?.id;
    const { latitude, longitude } = request.body;
    if (!id) {
      return response.status(400).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!latitude || !longitude) {
      return response.status(400).json({
        success: false,
        message: "Missing Longitude and Latitude",
      });
    }

    const userId = id;
    const hasWeather = await WeatherLocation.findOne({
        user_id: userId,
    }).exec();

    if (hasWeather) {
      await WeatherLocation.findOneAndUpdate(
        { latitude, longitude },
        {
            user_id: userId,
        }
      );
      const weather = await fetchWeather(latitude, longitude);
      return response.status(200).json({
        success: true,
        data: weather,
      });
    }
    await WeatherLocation.create({
      user_id: userId,
      longitude,
      latitude,
    });
    const weather = await fetchWeather(latitude, longitude);
    return response.status(200).json({
      success: true,
      data: weather,
    });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

const updateSettings = async (request: Request | any, response: Response) => {
  try {
    const id = request.user.id;
    let { type, token } = request.body;
    token = String(token);
    if (!id) {
      return response.status(400).json({
        success: false,
        message: "Access denied",
      });
    }
    switch (type) {
      case "PUSH_NOTIFICATION":
        await pushNotificationService(id, token);
        break;
      default:
        break;
    }
    return response.status(200).json({
      success: true,
      data: [],
    });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

const updateUserSettings = async (request: Request, response: Response) => {
  try {
    // @ts-ignore
    const id = request.user.id;
    const { type, firstName, lastName, state } = request.body;

    if (!id) {
      return response.status(400).json({
        success: false,
        message: "Access denied",
      });
    }

    let success = false;
    switch (type) {
      case 'SET_NAME':
        success = await updateUserDetails(firstName, lastName, id);
        break;
      case 'SET_EMAIL_NOTIFICATION':
        success = await updateEmailNotification(id, state);
      default:
        break;
    }
    if (!success) {
      return response.status(400).json({
        success: false,
        message: "Failed to update record",
      });      
    }
    return response.status(200).json({
      success: true,
      message: "Successfully update record",
    });

  } catch (error) {
    logger.error(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
}

export default { getSettings, userWeather, setUserLocation, updateSettings, updateUserSettings };
