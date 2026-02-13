import bcrypt from 'bcrypt';
import { findUserByUsername, createUser } from './userService';
import { User } from '../types/auth';

export async function login(username: string, password: string): Promise<User | null> {
  const user = await findUserByUsername(username);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

export async function signup(username: string, password: string): Promise<User | null> {
  const existing = await findUserByUsername(username);
  if (existing) return null;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(username, hashedPassword);

  return user;
}