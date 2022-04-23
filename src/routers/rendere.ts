import express, { Request, Response } from 'express';
import sendPushNotification from '../helpers/sendPushNotification';
import DataFrame from '../interface/data-frame-interface';
import ArticleModel from '../models/Mongodb/Articles';

const renderer = async (req: Request, res: Response) => {
    try {
        const articles = await ArticleModel.find({}).limit(10) as DataFrame[];
        await sendPushNotification('ExponentPushToken[_DBC6uOBvTN9kUUudAmdEE]', articles);
        res.render('emails', { data: articles });
    } catch (error) {
        res.send('Error');
    }
}

const router = express.Router();

router.get('/', renderer);

export default router;