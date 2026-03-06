import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { AuthError } from '../errors/AuthError';
import { jwtPayloadSchema } from '../schemas/auth';

export const authenticateToken: RequestHandler = (req, _res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthError('Access token required');
  }

  const token = authHeader.split(' ')[1];

  let decoded: unknown;

  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const trace = err instanceof Error ? err : undefined;
    throw new AuthError('Invalid or expired token', trace);
  }

  console.log(decoded);
  const parsed = jwtPayloadSchema.safeParse(decoded);

  if (!parsed.success) {
    throw new AuthError('Invalid token payload');
  }

  req.user = parsed.data;
  next();
};