import { RequestHandler } from 'express';
import { AuthError } from '../errors/AuthError';
import { ClientError } from '../errors/ClientError';
import { JwtPayload } from '../schemas/auth';
import { login, signup } from '../services/authService';
import { signToken } from '../utils/jwt';

const buildAuthResponse = (payload: JwtPayload) => {
  return {
    ...payload,
    authToken: signToken(payload),
  };
};

export const loginUser: RequestHandler = async (req, res) => {
  const { username, password } = req.body;

  const user = await login(username, password);

  if (!user) {
    throw new AuthError('Invalid username or password');
  }

  const authResponse = buildAuthResponse(user);
  res.status(200).json(authResponse);
}

export const signUpUser: RequestHandler = async (req, res) => {
  const { username, password } = req.body;

  const user = await signup(username, password);

  if (!user) {
    throw new ClientError('Username already exists');
  }

  const authResponse = buildAuthResponse(user);
  res.status(200).json(authResponse);
}
