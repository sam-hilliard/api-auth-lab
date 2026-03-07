import { Router } from 'express';
import { AuthError } from '../errors/AuthError';
import { ClientError } from '../errors/ClientError';
import { validateBody } from '../middleware/validateBody';
import { authSchema } from '../schemas/auth';
import { loginUser, signUpUser } from '../controllers/authControllers'
const router = Router();

router.post('/login', validateBody(authSchema), loginUser);
router.post('/signup', validateBody(authSchema), signUpUser);

export default router;
