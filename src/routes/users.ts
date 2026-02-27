import { Router } from 'express';
import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import { findUserById } from '../services/userService';

const router = Router();

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const reqId = Number(req.params.id);
  const userId = Number(req.user?.userId);

  if (!reqId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (userId !== reqId) {
    return res.status(401).json({ error: `Unauthorized to access user with ID ${reqId}.` });
  }

  const user = await findUserById(reqId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

export default router;
