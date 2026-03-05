import { Router } from 'express';
import { findUserById } from '../services/userService';

const router = Router();

router.get('/:id', async (req, res) => {
  const reqId = Number(req.params.id);
  const userId = Number(req.user.id);

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
