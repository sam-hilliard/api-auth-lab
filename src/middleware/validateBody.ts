import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ClientError } from '../errors/ClientError';

export const validateBody = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ClientError(error.message);
      } else {
        res.status(500).json({
          error: 'Internal Server Error',
        });
      }
    }
  };
};