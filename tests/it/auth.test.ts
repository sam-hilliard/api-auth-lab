import { log } from 'node:console';
import { 
    signUpReq, 
    loginReq, 
    buildUser, 
    queryUsersByName,
    cleanUpDB,
    reqUserById,
    getUserIdFromToken
} from '../helpers/utils';
import { getUserById } from '../../src/controllers/users';

describe('Authentication: Signup', () => {

    beforeEach(async () => {
        await cleanUpDB();
    });

    it('should create user and return auth token', async () => {
        const testuser = buildUser();
        const res = await signUpReq(testuser.username, testuser.password);
        expect(res.status).toBe(200); 
        expect(res.body).toMatchObject({
            userId: expect.any(Number),
            userName: testuser.username,
            authToken: expect.any(String)
        });

        const users = await queryUsersByName(testuser.username);
        expect(users.length).toBe(1);
    });

    it('should return error if username already exists', async () => {
        const testuser = buildUser();
        await signUpReq(testuser.username, testuser.password);
        const res = await signUpReq(testuser.username, testuser.password);
        expect(res.status).toBe(400); 
        expect(res.body).toMatchObject({
            error: expect.any(String)
        });

        const users = await queryUsersByName(testuser.username);
        expect(users.length).toBe(1);
    })

    it('should require username and password', async () => {
        const res = await signUpReq('', '');
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
            error: expect.any(String)
        });

        const users = await queryUsersByName('');
        expect(users.length).toBe(0);
    })
});

describe('Authentication: Login', () => {
  let testuser: { username: string; password: string };

  beforeAll(async () => {
    testuser = buildUser();
    const signupRes = await signUpReq(testuser.username, testuser.password);
    expect(signupRes.status).toBe(200);
  });

  it('should login user and return auth token', async () => {
    const loginRes = await loginReq(testuser.username, testuser.password);
    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toMatchObject({
      authToken: expect.any(String),
    });
  });

  it('should return error if username or password is incorrect', async () => {
    const loginRes = await loginReq(testuser.username, 'wrong-password');
    expect(loginRes.status).toBe(401);
    expect(loginRes.body).toMatchObject({
      error: expect.any(String),
    });
  });

  it('should return error if username or password is missing', async () => {
    const loginRes = await loginReq('', '');
    expect(loginRes.status).toBe(400);
    expect(loginRes.body).toMatchObject({
      error: expect.any(String),
    });
  });
});

describe('Authentication: JWT', () => {
  
  let testuser: { username: string; password: string };
  let token: string;
  let userId: number;

  beforeAll(async () => {
    testuser = buildUser();
    const signupRes = await signUpReq(testuser.username, testuser.password);
    expect(signupRes.status).toBe(200);
    token = signupRes.body.authToken;
    userId = signupRes.body.userId;
  });

  it('should access protected route with valid JWT', async () => {
    const res = await reqUserById(token, userId);
    expect(res.status).toBe(200);
    expect(res.body).not.toMatchObject({error: expect.any(String)});
  });

  it('should not access protected route with invalid JWT', async () => {
    const invalidJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJOYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NzE4NjI3NDAsImV4cCI6MTc3MTg2MzY0MH0.x';
    const res = await reqUserById(invalidJWT, userId);
    expect(res.status).toBe(403); 
    expect(res.body).toMatchObject({error: expect.any(String)});
  });

  it('should not access protected route with expired JWT', async () => {
    const expiredJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJOYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NzE4NjI3NDAsImV4cCI6MTc3MTg2MzY0MH0.IBsJvu5Gx5WwNu1MGdc0-syNp-eMGZ78rYJR84OKvBU';
    const res = await reqUserById(expiredJWT, userId);
    expect(res.status).toBe(403); 
    expect(res.body).toMatchObject({error: expect.any(String)});
  });

  it('should not access protected route with no JWT', async () => {
    const res = await reqUserById('', userId);
    expect(res.status).toBe(403); 
    expect(res.body).toMatchObject({error: expect.any(String)});
  });
});