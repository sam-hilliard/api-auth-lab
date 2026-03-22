import { Router } from 'express';
import { loginUser, signUpUser } from '../controllers/authController';
import { validate } from '../middlewares/validateMiddleware';
import { authSchema } from '../schemas/authSchema';
const router = Router();

router.post('/login', validate(authSchema, 'body'), loginUser);
router.post('/signup', validate(authSchema, 'body'), signUpUser);

export default router;
