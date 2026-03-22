import { RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { z } from 'zod';
import { ClientError } from '../errors/ClientError';

export const validate =
  <T extends z.ZodTypeAny>(schema: T, property: 'body' | 'query' | 'params'): RequestHandler =>
  async (req, _res, next) => {
    try {
      let dataToValidate;
      if (property === 'body') dataToValidate = req.body;
      else if (property === 'query') dataToValidate = req.query;
      else dataToValidate = req.params;

      const parsed = await schema.parseAsync(dataToValidate);

      if (property === 'body') {
        req.body = parsed;
      } else if (property === 'query') {
        req.query = parsed as unknown as ParsedQs;
      } else if (property === 'params') {
        req.params = parsed as unknown as ParamsDictionary;
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ClientError(error.message));
      }
      next(error);
    }
  };
