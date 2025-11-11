import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { checkRequiredFields } from '../middleware/checkRequiredFields';

const router = Router();

router.post('/register', checkRequiredFields(['name', 'email', 'password']), registerUser);
router.post('/login', checkRequiredFields(['email', 'password']), loginUser);

export default router;
