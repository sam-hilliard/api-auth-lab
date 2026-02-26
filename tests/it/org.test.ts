import {
  createOrgReq,
  createTestUser,
  inviteOrgMemberReq,
  cleanUpDB
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
});