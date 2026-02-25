import request from 'supertest';
import app from '../../src/app';
import { pool } from '../../src/db';
import { User } from '../../src/types/auth';

export const cleanUpDB = async () => {
    await pool.query('TRUNCATE users, orgs, org_members RESTART IDENTITY CASCADE');
}

export const buildUser = () => ({
  username: `user_${Date.now()}`,
  password: 'password123'
});

export const signUpReq = async(username: String, password: String) => {
  return await request(app).post('/api/auth/signup').send({ username, password });
}

export const loginReq = async(username: String, password: String) => {
  return await request(app).post('/api/auth/login').send({ username, password });
}

export const queryUsersByName = async(username: String) => {
  const result = await pool.query<User>(
    'SELECT id, username, password FROM users WHERE username = $1',
    [username]
  );

  return result.rows;
}

export const reqUserById = async(authToken: String, userId: number) => {
  return await request(app).get(`/api/users/${userId}`).set('Authorization', `Bearer ${authToken}`);;
}

export const parseJwt = (token: String) => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export const getUserIdFromToken = (token: String) => {
    return parseJwt(token).userId;
}