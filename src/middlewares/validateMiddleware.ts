import { RequestHandler } from 'express';
import { z } from 'zod';
import { ClientError } from '../errors/ClientError';

export const validate =
  <T extends z.ZodTypeAny>(schema: T, property: 'body' | 'query' | 'params'): RequestHandler =>
  async (req, _req, next) => {
    try {
      // Use parseAsync to support async refinements
      const parsed = await schema.parseAsync(req[property]);
      req[property] = parsed;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ClientError(error.message));
      }
      next(error);
    }
  };
