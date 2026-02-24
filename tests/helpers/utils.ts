import request from 'supertest';
import app from '../../src/app';

export const buildUser = () => ({
  username: `user_${Date.now()}`,
  password: 'password123'
});

export const signUpReq = async(username: String, password: String) => {
  return await request(app).post('/api/auth/signup').send({ username, password });
}