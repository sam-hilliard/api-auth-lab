import { Router } from 'express';
import { getUserById } from '../controllers/users';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/:id', authenticateToken, getUserById);

export default router;
