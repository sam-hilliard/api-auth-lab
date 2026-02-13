import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import { findUserById } from '../services/userService';

export const getUserById = async (req: AuthRequest, res: Response) => {
  const reqId = Number(req.params.id);
  const userId = Number(req.user?.userId);

  if (!reqId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  if (userId !== reqId) {
    return res.status(401).json({ message: `Unauthorized to access user with ID ${reqId}.` });
  }

  const user = await findUserById(reqId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
};