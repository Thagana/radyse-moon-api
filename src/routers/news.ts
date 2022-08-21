import express from 'express';
import news from '../controllers/news/news';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/headlines', auth, news.headlines);
router.post('/search', news.search);
router.post('/fetch-news', news.fetchNews);

export default router;