import { Router } from 'express';
import { loginUser, signUpUser } from '../controllers/authControllers'
import { validateBody } from '../middlewares/validateBody';
import { authSchema } from '../schemas/auth';
const router = Router();

router.post('/login', validateBody(authSchema), loginUser);
router.post('/signup', validateBody(authSchema), signUpUser);

export default router;
