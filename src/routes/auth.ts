import { Router } from 'express';
import { AuthError } from '../errors/AuthError';
import { ClientError } from '../errors/ClientError';
import { authSchema } from '../schemas/auth';
import { login, signup } from '../services/authService';
import { signToken } from '../utils/jwt';
const router = Router();

const buildAuthResponse = (user: { id: string; username: string }) => {
  const payload = {
    userId: user.id,
    userName: user.username,
  };

  return {
    userId: user.id,
    userName: user.username,
    authToken: signToken(payload),
  };
};

router.post('/login', validateBody(authSchema), async (req, res) => {
  const { username, password } = req.body;

  const user = await login(username, password);

  if (!user) {
    throw new AuthError('Invalid username or password');
  }

  const authResponse = buildAuthResponse(user);
  res.status(200).json(authResponse);
});

router.post('/signup', validateBody(authSchema), async (req, res) => {
  const { username, password } = req.body;

  const user = await signup(username, password);

  if (!user) {
    throw new ClientError('Username already exists');
  }

  const authResponse = buildAuthResponse(user);
  res.status(200).json(authResponse);
});

export default router;
