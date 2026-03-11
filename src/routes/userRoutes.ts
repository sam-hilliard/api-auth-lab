// userRoutes.ts

import { Router } from 'express';
import { getUserById } from '../controllers/userController';
import { validate } from '../middlewares/validateMiddleware';
import { userParamsSchema } from '../schemas/userSchema';
import { authorizeSelf } from '../middlewares/authMiddleware';

const router = Router();


router.get('/:id', validate(userParamsSchema, 'params'), authorizeSelf, getUserById);

export default router;
