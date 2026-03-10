import { RequestHandler } from 'express';
import { findUserById } from '../services/userService';

export const getUserById: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  const userId = Number(req.user.id);

  if (userId !== id) {
    return res.status(401).json({ error: `Unauthorized to access user with ID ${id}.` });
  }

  const user = await findUserById(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
};
