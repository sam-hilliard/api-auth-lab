import { log } from 'node:console';
import { 
    signUpReq, 
    loginReq, 
    buildUser, 
    queryUsersByName,
    cleanUpDB
} from '../helpers/utils';

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
  // define in outer scope so both beforeAll and it can use the same user
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