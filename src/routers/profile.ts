import { Router } from 'express';
import profile from '../controllers/profile/profile';
import auth from '../middleware/auth';

const router = Router();

router.get('/settings', auth, profile.getSettings);

export default router;