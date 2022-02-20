import express from 'express';
import news from '../controllers/news/news';

const router = express.Router();

router.get('/headlines', news.headlines);

export default router;