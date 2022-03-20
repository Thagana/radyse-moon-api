import axios from "axios";
import logger from "../utils/logger";

export default async function sendPushNotification(expoPushToken: string) {
  try {
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
  } catch (error) {
    logger.error(error);
  }
}
