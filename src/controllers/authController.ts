import { RequestHandler } from 'express';
import { AuthenticationError } from '../errors/AuthError';
import { ClientError } from '../errors/ClientError';
import { login, signup } from '../services/authService';
import { buildAuthResponse } from '../utils/auth';

export const loginUser: RequestHandler = async (req, res) => {
  const { username, password } = req.body;

  const user = await login(username, password);

  if (!user) {
    throw new AuthenticationError('Invalid username or password');
  }

  const authResponse = buildAuthResponse(user);
  res.status(201).json(authResponse);
};

export const signUpUser: RequestHandler = async (req, res) => {
  const { username, password } = req.body;

  const user = await signup(username, password);

  if (!user) {
    throw new ClientError('Username already exists');
  }

  const authResponse = buildAuthResponse(user);
  res.status(200).json(authResponse);
};
