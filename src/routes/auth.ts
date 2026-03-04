import { Router } from 'express';
import { login, signup } from '../services/authService';
import { signToken } from '../utils/jwt';
import { ClientError } from '../errors/ClientError';
import { AuthError } from '../errors/AuthError';
const router = Router();
import { authSchema } from '../schemas/auth';

router.post('/login', async (req, res) => {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ClientError(parsed.error.message);
  }

  const { username, password } = parsed.data;

  const user = await login(username, password);

  if (!user) {
    throw new AuthError('Invalid username or password');
  }

  const data = {
    userId: user.id,
    userName: user.username,
  };

  const token = signToken(data);
  res.status(200).json({ authToken: token });
});

router.post('/signup', async (req, res) => {

  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ClientError(parsed.error.message);
  }

  const { username, password } = parsed.data;

  const user = await signup(username, password);

  if (!user) {
    throw new ClientError('Username already exists');
  }

  let data = {
    userId: user.id,
    userName: user.username,
  };

  const token = signToken(data);

  res.status(200).json({ userId: user.id, userName: user.username, authToken: token });
});

export default router;
