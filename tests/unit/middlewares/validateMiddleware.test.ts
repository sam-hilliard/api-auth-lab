import { Request, NextFunction } from 'express';
import { z } from 'zod';

import { ClientError } from '../../../src/errors/ClientError';
import { validate } from '../../../src/middlewares/validateMiddleware';

describe('validate middleware', () => {
  let req: Partial<Request>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {},
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  describe('body validation', () => {
    const schema = z.object({
      username: z.string(),
      age: z.number(),
    });

    it('parses and replaces req.body when valid', async () => {
      req.body = {
        username: 'john',
        age: 25,
      };

      const middleware = validate(schema, 'body');

      await middleware(req as Request, {} as any, next);

      expect(req.body).toEqual({
        username: 'john',
        age: 25,
      });

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });

    it('passes ClientError to next when body is invalid', async () => {
      req.body = {
        username: 'john',
        age: 'not-a-number',
      };

      const middleware = validate(schema, 'body');

      await middleware(req as Request, {} as any, next);

      expect(next).toHaveBeenCalledWith(expect.any(ClientError));
    });
  });

  describe('query validation', () => {
    const schema = z.object({
      page: z.coerce.number(),
    });

    it('parses and replaces req.query when valid', async () => {
      req.query = {
        page: '1',
      };

      const middleware = validate(schema, 'query');

      await middleware(req as Request, {} as any, next);

      expect(req.query).toEqual({
        page: 1,
      });

      expect(next).toHaveBeenCalledWith();
    });

    it('passes ClientError to next when query is invalid', async () => {
      req.query = {
        page: 'abc',
      };

      const middleware = validate(schema, 'query');

      await middleware(req as Request, {} as any, next);

      expect(next).toHaveBeenCalledWith(expect.any(ClientError));
    });
  });

  describe('params validation', () => {
    const schema = z.object({
      id: z.coerce.number(),
    });

    it('parses and replaces req.params when valid', async () => {
      req.params = {
        id: '123',
      };

      const middleware = validate(schema, 'params');

      await middleware(req as Request, {} as any, next);

      expect(req.params).toEqual({
        id: 123,
      });

      expect(next).toHaveBeenCalledWith();
    });

    it('passes ClientError to next when params are invalid', async () => {
      req.params = {
        id: 'abc',
      };

      const middleware = validate(schema, 'params');

      await middleware(req as Request, {} as any, next);

      expect(next).toHaveBeenCalledWith(expect.any(ClientError));
    });
  });

  describe('unexpected errors', () => {
    it('passes non-Zod errors to next', async () => {
      const schema = {
        parseAsync: jest.fn().mockRejectedValue(new Error('Unexpected error')),
      } as unknown as z.ZodTypeAny;

      const middleware = validate(schema, 'body');

      await middleware(req as Request, {} as any, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Unexpected error',
        }),
      );
    });
  });
});
