import { Router } from 'express';
import { loginUser, signUpUser } from '../controllers/authControllers'
import { validate } from '../middlewares/validateMiddleware';
import { authSchema } from '../schemas/auth';
const router = Router();

router.post('/login', validate(authSchema), loginUser);
router.post('/signup', validate(authSchema), signUpUser);

export default router;
