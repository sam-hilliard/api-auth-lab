import bcrypt from 'bcrypt';
import { findUserByUsername, createUser } from '../repositories/userRepository';

export const login = async (username: string, password: string) => {
  const user = await findUserByUsername(username);

  if (!user || !user.password) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
};

export const signup = async (username: string, password: string) => {
  const existing = await findUserByUsername(username);
  if (existing) return null;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(username, hashedPassword);

  return user;
};
