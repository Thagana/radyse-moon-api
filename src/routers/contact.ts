import { Router } from "express";
import contact from '../controllers/contact/contact';

const router = Router();

router.post('/', contact.contact);

export default router;