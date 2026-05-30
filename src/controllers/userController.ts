import { RequestHandler } from 'express';
import { findUserById } from '../repositories/userRepository';

export const getUserById: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);

  const user = await findUserById(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
};
