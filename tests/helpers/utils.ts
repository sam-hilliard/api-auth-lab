import request from 'supertest';
import app from '../../src/app';
import { pool } from '../../src/db';
import { User } from '../../src/types/auth';
import { AuthenticatedTestUser, TestUserCredentials } from './types';

export const cleanUpDB = async () => {
    await pool.query('TRUNCATE org_members, orgs, users RESTART IDENTITY CASCADE');
};

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

export const createOrgReq = async( authToken: String, orgName: String) => {
  return await request(app).post('/api/orgs').set('Authorization', `Bearer ${authToken}`).send({ name: orgName });
}

export const inviteOrgMemberReq = async(orgId: number, username: String, authToken: String) => {
  return await request(app).post(`/api/orgs/${orgId}/invite`).set('Authorization', `Bearer ${authToken}`).send({ username });
}

export const createTestUser = async() => {
    const creds: TestUserCredentials = buildUser();
    let signupRes = await signUpReq(creds.username, creds.password);
    expect(signupRes.status).toBe(200);
    const authToken = signupRes.body.authToken;
    const userId = signupRes.body.userId;
    const testUser: AuthenticatedTestUser = {...creds, authToken, userId };

    return testUser;
}

export const orgDetailsReq = async(orgId: number, authToken: String) => {
  return await request(app).get(`/api/orgs/${orgId}`).set('Authorization', `Bearer ${authToken}`);
}

export const removeOrgMemberReq = async(orgId: number, username: String, authToken: String) => {
  return await request(app).delete(`/api/orgs/${orgId}/${username}`).set('Authorization', `Bearer ${authToken}`);
}