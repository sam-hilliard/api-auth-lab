import jwt from 'jsonwebtoken';
import { AuthError } from '../errors/AuthError';
import { jwtPayloadSchema } from '../schemas/auth';
import { RequestHandler } from 'express';

export const authenticateToken: RequestHandler = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthError('Access token required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const parsed = jwtPayloadSchema.safeParse(decoded);

    if (!parsed.success) {
      throw new AuthError('Invalid token payload');
    }

    req.user = parsed.data;
  } catch {
    throw new AuthError('Invalid or expired token');
  }
};
