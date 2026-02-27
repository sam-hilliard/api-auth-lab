import {
  createOrgReq,
  createTestUser,
  inviteOrgMemberReq,
  cleanUpDB,
  orgDetailsReq,
  removeOrgMemberReq
} from '../helpers/utils';

import { isOwner } from '../../src/services/orgService';

describe('Org: Create Organization', () => {

  beforeEach(async () => {
    await cleanUpDB();
  });

  it('should create org and assign creator as owner', async () => {
    const testOwner = await createTestUser();
    const orgName = 'Test Org';

    const res = await createOrgReq(testOwner.authToken, orgName);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      name: orgName,
      members: expect.arrayContaining([
        expect.objectContaining({
          username: testOwner.username,
          role: 'owner'
        })
      ])
    });

    const ownerCheck = await isOwner(res.body.id, testOwner.userId);
    expect(ownerCheck).toBe(true);
  });

  it('should return error if org name is missing', async () => {
    const testOwner = await createTestUser();

    const res = await createOrgReq(testOwner.authToken, '');

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      error: expect.any(String)
    });
  });
});

describe('Org: Invite User', () => {

  beforeEach(async () => {
    await cleanUpDB();
  });

  it('should invite user to org if owner', async () => {
    const owner = await createTestUser();
    const member = await createTestUser();

    const orgRes = await createOrgReq(owner.authToken, 'Test Org');
    const orgId = orgRes.body.id;

    const inviteRes = await inviteOrgMemberReq(
      orgId,
      member.username,
      owner.authToken
    );

    expect(inviteRes.status).toBe(201);
    expect(inviteRes.body).toMatchObject({
      id: orgId,
      name: 'Test Org',
      members: expect.arrayContaining([
        expect.objectContaining({
          username: owner.username,
          role: 'owner'
        }),
        expect.objectContaining({
          username: member.username,
          role: 'member'
        })
      ])
    });
  });

  it('should return 403 if member tries to invite user', async () => {
    const owner = await createTestUser();
    const member = await createTestUser();
    const targetUser = await createTestUser();

    const orgRes = await createOrgReq(owner.authToken, 'Test Org');
    const orgId = orgRes.body.id;

    await inviteOrgMemberReq(orgId, member.username, owner.authToken);

    const inviteRes = await inviteOrgMemberReq(
      orgId,
      targetUser.username,
      member.authToken
    );

    expect(inviteRes.status).toBe(403);
    expect(inviteRes.body).toMatchObject({
      error: expect.any(String)
    });
  });

  it('should return 403 if non-member tries to invite user', async () => {
    const owner = await createTestUser();
    const nonMember = await createTestUser();
    const targetUser = await createTestUser();

    const orgRes = await createOrgReq(owner.authToken, 'Test Org');
    const orgId = orgRes.body.id;

    const inviteRes = await inviteOrgMemberReq(
      orgId,
      targetUser.username,
      nonMember.authToken
    );

    expect(inviteRes.status).toBe(403);
    expect(inviteRes.body).toMatchObject({
      error: expect.any(String)
    });
  });

  it('should return 400 if owner invites an existing member', async () => {
    const owner = await createTestUser();
    const member = await createTestUser();

    const orgRes = await createOrgReq(owner.authToken, 'Test Org');
    const orgId = orgRes.body.id;

    await inviteOrgMemberReq(orgId, member.username, owner.authToken);

    const inviteRes = await inviteOrgMemberReq(
      orgId,
      member.username,
      owner.authToken
    );

    expect(inviteRes.status).toBe(400);
    expect(inviteRes.body).toMatchObject({
      error: expect.any(String)
    });
  });

  it('should return 404 if org does not exist', async () => {
    const owner = await createTestUser();
    const member = await createTestUser();

    const inviteRes = await inviteOrgMemberReq(
      404,
      member.username,
      owner.authToken
    );

    expect(inviteRes.status).toBe(404);
    expect(inviteRes.body).toMatchObject({
      error: expect.any(String)
    });
  });

  it('should return 404 if user does not exist', async () => {
    const owner = await createTestUser();

    const orgRes = await createOrgReq(owner.authToken, 'Test Org');
    const orgId = orgRes.body.id;

    const inviteRes = await inviteOrgMemberReq(
      orgId,
      'does-not-exist',
      owner.authToken
    );

    expect(inviteRes.status).toBe(404);
    expect(inviteRes.body).toMatchObject({
      error: expect.any(String)
    });
  });
});

describe('Org: View Org Details', () => {
  beforeEach(async () => {
    await cleanUpDB();
  });


  it('should allow owner and member to view org details', async () => {
    const owner = await createTestUser();
    const member = await createTestUser();

    const orgRes = await createOrgReq(owner.authToken, 'Test Org');
    const orgId = orgRes.body.id;

    await inviteOrgMemberReq(orgId, member.username, owner.authToken);

    const expectedBody = {
      id: orgId,
      name: 'Test Org',
      members: expect.arrayContaining([
        expect.objectContaining({
          username: owner.username,
          role: 'owner'
        }),
        expect.objectContaining({
          username: member.username,
          role: 'member'
        })
      ])
    };

    const resOwner = await orgDetailsReq(orgId, owner.authToken);
    const resMember = await orgDetailsReq(orgId, member.authToken);

    expect(resOwner.status).toBe(200);
    expect(resOwner.body).toMatchObject(expectedBody);

    expect(resMember.status).toBe(200);
    expect(resMember.body).toMatchObject(expectedBody);
});

  it('should return 403 if member/owner views org they are not a member of', async () => {
    const owner = await createTestUser();
    const nonMember = await createTestUser();

    const orgRes = await createOrgReq(owner.authToken, 'Test Org');
    const orgId = orgRes.body.id;

    const res = await orgDetailsReq(orgId, nonMember.authToken);

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({
      error: expect.any(String)
    });
  });
});

describe('Org: Remove Member', () => {
  it('should allow org owner to remove a member', async () => {
    const owner = await createTestUser();
    const member = await createTestUser();

    const orgRes = await createOrgReq(owner.authToken, 'Test Org');
    const orgId = orgRes.body.id;

    await inviteOrgMemberReq(orgId, member.username, owner.authToken);

    const res = await removeOrgMemberReq(orgId, member.username, owner.authToken);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      message: expect.any(String)
    });
  });

  it('should not allow a member to remove another member', async () => {
    const owner = await createTestUser();
    const member1 = await createTestUser();
    const member2 = await createTestUser();

    const orgRes = await createOrgReq(owner.authToken, 'Test Org');
    const orgId = orgRes.body.id;

    await inviteOrgMemberReq(orgId, member1.username, owner.authToken);
    await inviteOrgMemberReq(orgId, member2.username, owner.authToken);

    const res = await removeOrgMemberReq(orgId, member2.username, member1.authToken);

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({
      error: expect.any(String)
    });
  });

  it('should not allow an org owner to remove themselves', async () => {
    const owner = await createTestUser();

    const orgRes = await createOrgReq(owner.authToken, 'Test Org');
    const orgId = orgRes.body.id;

    const res = await removeOrgMemberReq(orgId, owner.username, owner.authToken);

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({
      error: expect.any(String)
    });
  });
})