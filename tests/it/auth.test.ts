import { signUpReq, buildUser } from '../helpers/utils';

describe('Authentication', () => {

    it('User signup', async () => {
        const testuser = buildUser();
        const res = await signUpReq(testuser.username, testuser.password);
        expect(res.status).toBe(200); 
        expect(res.body).toMatchObject({
            userId: expect.any(Number),
            userName: testuser.username,
            authToken: expect.any(String)
        });
    });

    it('Usernames unique on signup', async () => {
        const testuser = buildUser();
        await signUpReq(testuser.username, testuser.password);
        const res = await signUpReq(testuser.username, testuser.password);
        expect(res.status).toBe(400); 
        expect(res.body).toMatchObject({
            error: expect.any(String)
        });
    })

    it('Username and password are required fields', async () => {
        const res = await signUpReq('', '');
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
            error: expect.any(String)
        });
    })

});
