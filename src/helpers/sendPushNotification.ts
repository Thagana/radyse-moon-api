import axios from "axios";
import logger from "../utils/logger";

import DataFrame  from '../interface/data-frame-interface';

export default async function sendPushNotification(expoPushToken: string, data: DataFrame[] | undefined) {
  try {
    if (data) {
      for (const item of data) {
        const message = {
          to: expoPushToken,
          sound: "default",
          title: item.title,
          body: item.description,
        };
    
        await axios.post("https://exp.host/--/api/v2/push/send", message, {
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
        });
      }
    } else {
      const message = {
        to: expoPushToken,
        sound: "default",
        title: "News Fetched",
        body: "New News Articles have been fetched",
      };
  
      await axios.post("https://exp.host/--/api/v2/push/send", message, {
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    logger.error(error);
  }
}
