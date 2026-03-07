import { RequestHandler } from 'express';
import { Request, NextFunction } from 'express'
import { z } from 'zod';
import { ClientError } from '../errors/ClientError';

export const validate =
  (schema: z.ZodSchema): RequestHandler =>
  (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ClientError(error.message));
      }
      next(error);
    }
};
