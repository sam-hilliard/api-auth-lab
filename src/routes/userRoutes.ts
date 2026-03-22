// userRoutes.ts

import { Router } from 'express';
import { RequestHandler } from 'express';
import { getUserById } from '../controllers/userController';
import { authorizeSelf } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { userParamsSchema } from '../schemas/userSchema';

const router = Router();

router.get(
  '/:id',
  validate(userParamsSchema, 'params'),
  authorizeSelf as RequestHandler,
  getUserById,
);

export default router;
