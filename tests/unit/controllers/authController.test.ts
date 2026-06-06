import { Request, Response } from 'express';
import { loginUser, signUpUser } from '../../../src/controllers/authController';

import { AuthenticationError } from '../../../src/errors/AuthError';
import { ClientError } from '../../../src/errors/ClientError';

import { login, signup } from '../../../src/services/authService';

import { buildAuthResponse } from '../../../src/utils/auth';

jest.mock('../../../src/services/authService');
jest.mock('../../../src/utils/auth');

const mockedLogin = jest.mocked(login);
const mockedSignup = jest.mocked(signup);
const mockedBuildAuthResponse = jest.mocked(buildAuthResponse);

describe('authController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        password: 'password123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('returns auth response when credentials are valid', async () => {
      const user = {
        id: 1,
        username: 'testuser',
      };

      const authResponse = {
        token: 'jwt-token',
        user,
      };

      mockedLogin.mockResolvedValue(user as any);
      mockedBuildAuthResponse.mockReturnValue(authResponse as any);

      await loginUser(req as Request, res as Response, jest.fn());

      expect(mockedLogin).toHaveBeenCalledWith('testuser', 'password123');

      expect(mockedBuildAuthResponse).toHaveBeenCalledWith(user);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(authResponse);
    });

    it('throws AuthenticationError when login fails', async () => {
      mockedLogin.mockResolvedValue(null);

      await expect(loginUser(req as Request, res as Response, jest.fn())).rejects.toThrow(
        AuthenticationError,
      );

      await expect(loginUser(req as Request, res as Response, jest.fn())).rejects.toThrow(
        'Invalid username or password',
      );
    });
  });

  describe('signUpUser', () => {
    it('returns auth response when signup succeeds', async () => {
      const user = {
        id: 1,
        username: 'testuser',
      };

      const authResponse = {
        token: 'jwt-token',
        user,
      };

      mockedSignup.mockResolvedValue(user as any);
      mockedBuildAuthResponse.mockReturnValue(authResponse as any);

      await signUpUser(req as Request, res as Response, jest.fn());

      expect(mockedSignup).toHaveBeenCalledWith('testuser', 'password123');

      expect(mockedBuildAuthResponse).toHaveBeenCalledWith(user);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(authResponse);
    });

    it('throws ClientError when username already exists', async () => {
      mockedSignup.mockResolvedValue(null);

      await expect(signUpUser(req as Request, res as Response, jest.fn())).rejects.toThrow(
        ClientError,
      );

      await expect(signUpUser(req as Request, res as Response, jest.fn())).rejects.toThrow(
        'Username already exists',
      );
    });
  });
});
