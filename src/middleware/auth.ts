import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthError } from '../errors/AuthError';
import { jwtPayloadSchema } from '../schemas/auth';
import { AuthRequest, UserPayload } from '../types/auth';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthError('Access token required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === 'string' || !('id' in decoded)) {
      throw new AuthError('Invalid token payload');
    }

    req.user = decoded as UserPayload;

    const parsed = jwtPayloadSchema.safeParse(decoded);

    if (!parsed.success) {
      throw new AuthError('Invalid token payload');
    }

    next();
  } catch {
    throw new AuthError('Invalid or expired token');
  }
};
