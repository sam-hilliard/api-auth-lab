import { Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { AuthenticationError, AuthorizationError } from '../../../src/errors/AuthError';
import { authenticateToken, authorizeSelf } from '../../../src/middlewares/authMiddleware';

jest.mock('jsonwebtoken');

const mockedVerify = jest.mocked(jwt.verify);

describe('authMiddleware', () => {
  let req: Partial<Request>;
  let next: NextFunction;
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      JWT_SECRET: 'test-secret',
    };

    req = {
      headers: {},
      params: {},
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('authenticateToken', () => {
    it('throws when JWT_SECRET is not defined', () => {
      delete process.env.JWT_SECRET;

      expect(() => authenticateToken(req as Request, {} as any, next)).toThrow(
        'JWT_SECRET is not defined',
      );
    });

    it('throws AuthenticationError when authorization header is missing', () => {
      expect(() => authenticateToken(req as Request, {} as any, next)).toThrow(AuthenticationError);

      expect(() => authenticateToken(req as Request, {} as any, next)).toThrow(
        'Access token required',
      );
    });

    it('throws AuthenticationError when authorization header is not Bearer', () => {
      req.headers = {
        authorization: 'Basic abc123',
      };

      expect(() => authenticateToken(req as Request, {} as any, next)).toThrow(AuthenticationError);
    });

    it('throws AuthenticationError when jwt.verify throws', () => {
      req.headers = {
        authorization: 'Bearer invalid-token',
      };

      mockedVerify.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      expect(() => authenticateToken(req as Request, {} as any, next)).toThrow(AuthenticationError);

      expect(() => authenticateToken(req as Request, {} as any, next)).toThrow(
        'Invalid or expired token',
      );
    });

    it('throws AuthenticationError when token payload is invalid', () => {
      req.headers = {
        authorization: 'Bearer valid-token',
      };

      mockedVerify.mockReturnValue({
        invalid: 'payload',
      } as any);

      expect(() => authenticateToken(req as Request, {} as any, next)).toThrow(AuthenticationError);

      expect(() => authenticateToken(req as Request, {} as any, next)).toThrow(
        'Invalid token payload',
      );
    });

    it('attaches user and calls next for a valid token', () => {
      req.headers = {
        authorization: 'Bearer valid-token',
      };

      const payload = {
        id: 123,
        username: 'testuser',
      };

      mockedVerify.mockReturnValue(payload as any);

      authenticateToken(req as Request, {} as any, next);

      expect(mockedVerify).toHaveBeenCalledWith('valid-token', 'test-secret');

      expect(req.user).toEqual(payload);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe('authorizeSelf', () => {
    it('calls next with AuthorizationError when ids do not match', () => {
      req = {
        params: {
          id: '999',
        },
        user: {
          id: 123,
        },
      } as any;

      authorizeSelf(req as Request, {} as any, next);

      expect(next).toHaveBeenCalledWith(expect.any(AuthorizationError));

      const error = (next as jest.Mock).mock.calls[0][0];

      expect(error.message).toBe('Cannot access user with ID 999');
    });

    it('calls next when ids match', () => {
      req = {
        params: {
          id: '123',
        },
        user: {
          id: 123,
        },
      } as any;

      authorizeSelf(req as Request, {} as any, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });
  });
});
