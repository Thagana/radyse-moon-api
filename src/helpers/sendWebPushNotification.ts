import webpush from "web-push";
import logger from "../utils/logger";
import { configs } from "../configs/app.configs";
import DataFrame from "../interface/data-frame-interface";

export default async function sendWebPushNotification(
  pushToken: unknown,
  data: DataFrame[] | undefined
) {
  try {
    webpush.setVapidDetails(
      configs.WEB_PUSH_CONTACT,
      configs.PUBLIC_VAPID_KEY,
      configs.PRIVATE_VAPID_KEY
    );
    const token = pushToken as webpush.PushSubscription
    if (data) {
      for (const item of data) {

        const payload = JSON.stringify({
          icon: 'https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4',
          image: item.urlToImage,
          title: item.title,
          body: item.description,
        });
        webpush
        .sendNotification(token, payload)
        .then()
        .catch((e) => logger.error(e.stack));

      }
    } else {

      const payload = JSON.stringify({
        title: 'News Fetched',
        body: 'New news articles are fetched',
      });

      webpush
      .sendNotification(token, payload)
      .then()
      .catch((e) => logger.error(e.stack));
    }
  } catch (error) {
    logger.error(error);
  }
}
