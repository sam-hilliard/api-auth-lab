import { createTestUser, userDetailsReq } from '../helpers/utils';

describe('User: Get User By ID', () => {

  it('should allow user to view their own details', async () => {
    const testUser = await createTestUser();
    const res = await userDetailsReq(testUser.userId, testUser.authToken);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: testUser.userId,
      username: testUser.username,
    });
  });

  it('should not allow user to view other user details', async () => {
    const testUser1 = await createTestUser();
    const testUser2 = await createTestUser();

    const res = await userDetailsReq(testUser2.userId, testUser1.authToken);

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
      error: expect.any(String)
    });

  });
 });