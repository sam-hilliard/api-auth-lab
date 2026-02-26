import {
  signUpReq,
  loginReq,
  buildUser,
  queryUsersByName,
  cleanUpDB,
  reqUserById,
  createTestUser
} from '../helpers/utils';

describe('Authentication: Signup', () => {

  beforeEach(async () => {
    await cleanUpDB();
  });

  it('should create user and return auth token', async () => {
    const creds = buildUser();

    const res = await signUpReq(creds.username, creds.password);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      userId: expect.any(Number),
      userName: creds.username,
      authToken: expect.any(String)
    });

    const users = await queryUsersByName(creds.username);
    expect(users).toHaveLength(1);
  });

  it('should return error if username already exists', async () => {
    const user = await createTestUser();

    const res = await signUpReq(user.username, user.password);

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      error: expect.any(String)
    });

    const users = await queryUsersByName(user.username);
    expect(users).toHaveLength(1);
  });

  it('should require username and password', async () => {
    const res = await signUpReq('', '');

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      error: expect.any(String)
    });

    const users = await queryUsersByName('');
    expect(users).toHaveLength(0);
  });
});

describe('Authentication: Login', () => {

  beforeEach(async () => {
    await cleanUpDB();
  });

  it('should login user and return auth token', async () => {
    const user = await createTestUser();

    const loginRes = await loginReq(user.username, user.password);

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toMatchObject({
      authToken: expect.any(String),
    });
  });

  it('should return error if username or password is incorrect', async () => {
    const user = await createTestUser();

    const loginRes = await loginReq(user.username, 'wrong-password');

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

  beforeEach(async () => {
    await cleanUpDB();
  });

  it('should access protected route with valid JWT', async () => {
    const user = await createTestUser();

    const res = await reqUserById(user.authToken, user.userId);

    expect(res.status).toBe(200);
    expect(res.body).not.toMatchObject({
      error: expect.any(String)
    });
  });

  it('should not access protected route with invalid JWT', async () => {
    const user = await createTestUser();

    const invalidJWT = 'invalid.token.value';

    const res = await reqUserById(invalidJWT, user.userId);

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({
      error: expect.any(String)
    });
  });

  it('should not access protected route with expired JWT', async () => {
    const user = await createTestUser();

    const expiredJWT = 'expired.token.value';

    const res = await reqUserById(expiredJWT, user.userId);

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({
      error: expect.any(String)
    });
  });

  it('should not access protected route with no JWT', async () => {
    const user = await createTestUser();

    const res = await reqUserById('', user.userId);

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({
      error: expect.any(String)
    });
  });
});