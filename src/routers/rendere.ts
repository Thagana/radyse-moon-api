import express, { Request, Response } from "express";
import sendPushNotification from "../helpers/sendPushNotification";
import sendWebPushNotification from "../helpers/sendWebPushNotification";
import DataFrame from "../interface/data-frame-interface";
import ArticleModel from "../models/Mongodb/Articles";
import PushToken from "../models/Mongodb/PushTokens";

const renderer = async (req: Request, res: Response) => {
  try {
    const articles = (await ArticleModel.find({}).limit(10)) as DataFrame[];
    
    const pushToken = await PushToken.findOne({
      user_id: "",
    });

    if (!pushToken) {
        return res.send('Error');
    }
    const token = JSON.parse(pushToken.token);
    // await sendPushNotification('', articles);
    await sendWebPushNotification(token, articles);
    return res.render("emails", { data: articles });
  } catch (error) {
    return res.send("Error");
  }
};

const router = express.Router();

router.get("/", renderer);

export default router;
