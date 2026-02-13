import { pool } from '../db';
import { User } from '../types/auth';

export const findUserById = async (id: number) => {
  const result = await pool.query(
    'SELECT id, username FROM users WHERE id = $1',
    [id]
  );

  return result.rows[0] || null;
};

export const findUserByUsername = async (username: string): Promise<User | null> => {
  const result = await pool.query<User>(
    'SELECT id, username, password FROM users WHERE username = $1',
    [username]
  );

  return result.rows[0] ?? null;
};