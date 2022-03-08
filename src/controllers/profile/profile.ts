import { Request, Response } from "express";
import NewsSettings from "../../models/SQL/NewsSettings";
import WeatherLocation from "../../models/SQL/WeatherLocation";
import fetchWeather from "../../Jobs/fetchWeather";
import logger from "../../utils/logger";
import Tokens from "../../models/SQL/PushTokens";

const pushNotificationService = async (userId: number, token: string) => {
  try {
    const tokens = await Tokens.findOne({
      where: {
        user_id: userId,
      },
    });
    if (!tokens) {
      await Tokens.create({
        user_id: userId,
        token: token,
      });
    }
    await Tokens.update(
      {
        token: token,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );
    await NewsSettings.update({
        push_enabled: 1
    }, {
        where: {
            user_id: userId
        }
    })
  } catch (error) {
    logger.error(error);
  }
};

const getSettings = async (
  request: Request | any,
  response: Response
): Promise<Response> => {
  try {
    const id = request?.user?.id;
    if (!id) {
      return response.status(400).json({
        success: false,
        message: "Access denied",
      });
    }
    const userId = Number(id);

    const settings = await NewsSettings.findOne({
      where: {
        user_id: userId,
      },
    });

    if (!settings) {
      return response.status(200).json({
        success: false,
        message: "could not find settings",
      });
    }
    return response.status(200).json({
      success: true,
      data: {
        location: settings.location,
        language: settings.language,
        frequency: settings.frequency,
        pushState: settings.push_enabled,
      },
    });
  } catch (error) {
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
        message: "Access denied",
      });
    }
    const userId = Number(id);
    const weather = await WeatherLocation.findOne({
      where: {
        user_id: userId,
      },
    });
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
    let { latitude, longitude } = request.body;
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

    latitude = Number(latitude);
    longitude = Number(longitude);

    const userId = Number(id);
    const hasWeather = await WeatherLocation.findOne({
      where: {
        user_id: userId,
      },
    });
    if (hasWeather) {
      await WeatherLocation.update(
        { latitude, longitude },
        {
          where: {
            user_id: userId,
          },
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
    const { type, token } = request.body;

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

export default { getSettings, userWeather, setUserLocation, updateSettings };
