// userRoutes.ts

import { Router } from 'express';
import { z } from 'zod';
import { getUserById } from '../controllers/userController';
import { validate } from '../middlewares/validateMiddleware';

const router = Router();

const paramSchema = z.object({
  id: z.coerce.number(),
});

router.get('/:id', validate(paramSchema), getUserById);

export default router;
