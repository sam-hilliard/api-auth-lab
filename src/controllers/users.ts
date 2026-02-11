import { Request, Response } from 'express';

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // TODO: Integrate DB
  const user = {
    id,
    username: 'testuser'
  };

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
};