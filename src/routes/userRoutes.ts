import { Router } from 'express';
import { getUserById } from '../controllers/userControllers';

const router = Router();

router.get('/:id', getUserById);

export default router;
