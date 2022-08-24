"use strict";
// import express, { Request, Response } from "express";
// import sentMailNotification from "../helpers/sendMailNotification";
// import sendPushNotification from "../helpers/sendPushNotification";
// import sendWebPushNotification from "../helpers/sendWebPushNotification";
// import DataFrame from "../interface/data-frame-interface";
// import ArticleModel from "../data/infrastructure/db/entities/Articles";
// import PushToken from "../data/infrastructure/db/entities/Mongodb/PushTokens";
// const renderer = async (req: Request, res: Response) => {
//   try {
//     const articles = (await ArticleModel.find({}).limit(10)) as DataFrame[];
//     // const pushToken = await PushToken.findOne({
//     //   user_id: "",
//     // });
//     // if (!pushToken) {
//     //     return res.send('Error');
//     // }
//     // const token = JSON.parse(pushToken.token);
//     // await sendPushNotification('', articles);
//     // await sendWebPushNotification(token, articles);
//     // await sentMailNotification('', articles);
//     return res.send('GO');
//   } catch (error) {
//     return res.send("Error");
//   }
// };
// const router = express.Router();
// router.get("/", renderer);
// export default router;
