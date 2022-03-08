import { Router } from 'express';
import profile from '../controllers/profile/profile';
import auth from '../middleware/auth';

const router = Router();

router.get('/settings', auth, profile.getSettings);
router.get('/user_weather', auth, profile.userWeather);
router.post('/weather-location', auth, profile.setUserLocation)
router.post('/push-token', auth, profile.updateSettings)

export default router;