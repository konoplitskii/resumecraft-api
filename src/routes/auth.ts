import { Router } from 'express';
import { registerUser } from '../controllers/authController';
import { checkRequiredFields } from '../middleware/checkRequiredFields';

const router = Router();

router.post('/register', checkRequiredFields(['name', 'email', 'password']), registerUser);

export default router;
