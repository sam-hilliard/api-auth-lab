import {
  createOrgReq,
  createTestUser,
  inviteOrgMemberReq,
  cleanUpDB,
  orgDetailsReq,
  removeOrgMemberReq,
  createOrgWithMembers
} from '../helpers/utils';

import { isOwner } from '../../src/services/orgService';

beforeEach(async () => {
  await cleanUpDB();
});

describe('Org', () => {

  describe('Create Organization', () => {

    it('should create org and assign creator as owner', async () => {
      const owner = await createTestUser();

      const res = await createOrgReq(owner.authToken, 'Test Org');

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(Number),
        name: 'Test Org',
        members: expect.arrayContaining([
          expect.objectContaining({
            username: owner.username,
            role: 'owner'
          })
        ])
      });

      expect(await isOwner(res.body.id, owner.userId)).toBe(true);
    });

    it('should return error if org name is missing', async () => {
      const owner = await createTestUser();

      const res = await createOrgReq(owner.authToken, '');

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        error: expect.any(String)
      });
    });

  });

  describe('Invite User', () => {

    it('should invite user to org if owner', async () => {
      const { orgId, owner } =
        await createOrgWithMembers({ memberCount: 0 });

      const newMember = await createTestUser();

      const res = await inviteOrgMemberReq(
        orgId,
        newMember.username,
        owner.authToken
      );

      expect(res.status).toBe(201);
    });

    it('should return 403 if member tries to invite user', async () => {
      const { orgId, members } =
        await createOrgWithMembers({ memberCount: 1 });

      const member = members[0];
      const targetUser = await createTestUser();

      const res = await inviteOrgMemberReq(
        orgId,
        targetUser.username,
        member.authToken
      );

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        error: expect.any(String)
      });
    });

    it('should return 403 if non-member tries to invite user', async () => {
      const { orgId } =
        await createOrgWithMembers({ memberCount: 0 });

      const nonMember = await createTestUser();
      const targetUser = await createTestUser();

      const res = await inviteOrgMemberReq(
        orgId,
        targetUser.username,
        nonMember.authToken
      );

      expect(res.status).toBe(403);
    });

    it('should return 400 if owner invites an existing member', async () => {
      const { orgId, owner, members } =
        await createOrgWithMembers({ memberCount: 1 });

      const existingMember = members[0];

      const res = await inviteOrgMemberReq(
        orgId,
        existingMember.username,
        owner.authToken
      );

      expect(res.status).toBe(400);
    });

    it('should return 404 if org does not exist', async () => {
      const owner = await createTestUser();
      const member = await createTestUser();

      const res = await inviteOrgMemberReq(
        9999,
        member.username,
        owner.authToken
      );

      expect(res.status).toBe(404);
    });

    it('should return 404 if user does not exist', async () => {
      const { orgId, owner } =
        await createOrgWithMembers({ memberCount: 0 });

      const res = await inviteOrgMemberReq(
        orgId,
        'does-not-exist',
        owner.authToken
      );

      expect(res.status).toBe(404);
    });

  });

  describe('View Org Details', () => {

    it('should allow owner and member to view org details', async () => {
      const { orgId, owner, members } =
        await createOrgWithMembers({ memberCount: 1 });

      const member = members[0];

      const resOwner = await orgDetailsReq(orgId, owner.authToken);
      const resMember = await orgDetailsReq(orgId, member.authToken);

      expect(resOwner.status).toBe(200);
      expect(resMember.status).toBe(200);
    });

    it('should return 403 if non-member views org', async () => {
      const { orgId } =
        await createOrgWithMembers({ memberCount: 0 });

      const nonMember = await createTestUser();

      const res = await orgDetailsReq(orgId, nonMember.authToken);

      expect(res.status).toBe(403);
    });

  });

  describe('Remove Member', () => {

    it('should allow org owner to remove a member', async () => {
      const { orgId, owner, members } =
        await createOrgWithMembers({ memberCount: 1 });

      const member = members[0];

      const res = await removeOrgMemberReq(
        orgId,
        member.username,
        owner.authToken
      );

      expect(res.status).toBe(200);
    });

    it('should not allow a member to remove another member', async () => {
      const { orgId, members } =
        await createOrgWithMembers({ memberCount: 2 });

      const [member1, member2] = members;

      const res = await removeOrgMemberReq(
        orgId,
        member2.username,
        member1.authToken
      );

      expect(res.status).toBe(403);
    });

    it('should not allow an org owner to remove themselves', async () => {
      const { orgId, owner } =
        await createOrgWithMembers({ memberCount: 0 });

      const res = await removeOrgMemberReq(
        orgId,
        owner.username,
        owner.authToken
      );

      expect(res.status).toBe(403);
    });

  });

});