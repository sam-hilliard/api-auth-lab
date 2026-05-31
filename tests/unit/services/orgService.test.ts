import { AppError } from '../../../src/errors/AppError';
import { ClientError } from '../../../src/errors/ClientError';
import { NotFoundError } from '../../../src/errors/NotFoundError';
import {
  getMember,
  insertMember,
  deleteMember,
  getOrg,
  getMembers,
} from '../../../src/repositories/orgRepository';

import { findUserByUsername } from '../../../src/repositories/userRepository';

import {
  isOwner,
  addMember,
  isMemberExists,
  inviteUserToOrg,
  removeMemberFromOrg,
} from '../../../src/services/orgService';

jest.mock('../../../src/repositories/orgRepository');
jest.mock('../../../src/repositories/userRepository');

const mockGetMember = jest.mocked(getMember);
const mockInsertMember = jest.mocked(insertMember);
const mockDeleteMember = jest.mocked(deleteMember);
const mockGetOrg = jest.mocked(getOrg);
const mockGetMembers = jest.mocked(getMembers);

const mockFindUserByUsername = jest.mocked(findUserByUsername);

describe('orgService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isOwner', () => {
    test('returns false if member not found', async () => {
      mockGetMember.mockResolvedValue(null);

      await expect(isOwner(1, 1)).resolves.toBe(false);
    });

    test('returns false if role is not owner', async () => {
      mockGetMember.mockResolvedValue({
        orgId: 1,
        userId: 1,
        role: 'member',
      });

      await expect(isOwner(1, 1)).resolves.toBe(false);
    });

    test('returns true if role is owner', async () => {
      mockGetMember.mockResolvedValue({
        orgId: 1,
        userId: 1,
        role: 'owner',
      });

      await expect(isOwner(1, 1)).resolves.toBe(true);
    });
  });

  describe('addMember', () => {
    test('adds member and returns org with members', async () => {
      const org = { id: 1, name: 'Test Org' };
      const members = [
        { orgId: 1, userId: 1, role: 'member' },
        { orgId: 1, userId: 2, role: 'owner' },
      ];

      mockInsertMember.mockResolvedValue(undefined);
      mockGetOrg.mockResolvedValue(org);
      mockGetMembers.mockResolvedValue(members);

      const result = await addMember(1, 1, 'member');

      expect(mockInsertMember).toHaveBeenCalledWith(1, 1, 'member');
      expect(result).toEqual({
        ...org,
        members,
      });
    });
  });

  describe('isMemberExists', () => {
    test('returns false when member does not exist', async () => {
      mockGetMember.mockResolvedValue(null);

      await expect(isMemberExists(1, 1)).resolves.toBe(false);
    });

    test('returns true when member exists', async () => {
      mockGetMember.mockResolvedValue({
        orgId: 1,
        userId: 1,
        role: 'member',
      });

      await expect(isMemberExists(1, 1)).resolves.toBe(true);
    });
  });

  describe('inviteUserToOrg', () => {
    test('throws NotFoundError if user does not exist', async () => {
      mockFindUserByUsername.mockResolvedValue(null);

      await expect(inviteUserToOrg(1, 'missing-user')).rejects.toBeInstanceOf(NotFoundError);
    });

    test('throws ClientError if user is already a member', async () => {
      mockFindUserByUsername.mockResolvedValue({ id: 1, username: 'user' });

      mockGetMember.mockResolvedValue({
        orgId: 1,
        userId: 1,
        role: 'member',
      });

      await expect(inviteUserToOrg(1, 'user')).rejects.toBeInstanceOf(ClientError);
    });

    test('invites user successfully', async () => {
      mockFindUserByUsername.mockResolvedValue({ id: 1, username: 'user' });

      mockGetMember.mockResolvedValue(null); // not a member yet

      const org = { id: 1, name: 'Org' };
      const members = [{ orgId: 1, userId: 1, role: 'member' }];

      mockInsertMember.mockResolvedValue(undefined);
      mockGetOrg.mockResolvedValue(org);
      mockGetMembers.mockResolvedValue(members);

      const result = await inviteUserToOrg(1, 'user');

      expect(result).toEqual({
        ...org,
        members,
      });

      expect(mockInsertMember).toHaveBeenCalledWith(1, 1, 'member');
    });
  });

  describe('removeMemberFromOrg', () => {
    test('throws NotFoundError if user does not exist', async () => {
      mockFindUserByUsername.mockResolvedValue(null);

      await expect(removeMemberFromOrg(1, 'missing-user')).rejects.toBeInstanceOf(NotFoundError);
    });

    test('throws AppError if delete fails', async () => {
      mockFindUserByUsername.mockResolvedValue({ id: 1, username: 'user' });
      mockDeleteMember.mockResolvedValue(false);

      await expect(removeMemberFromOrg(1, 'user')).rejects.toBeInstanceOf(AppError);
    });

    test('removes member successfully', async () => {
      mockFindUserByUsername.mockResolvedValue({ id: 1, username: 'user' });
      mockDeleteMember.mockResolvedValue(true);

      await expect(removeMemberFromOrg(1, 'user')).resolves.toBeUndefined();

      expect(mockDeleteMember).toHaveBeenCalledWith(1, 1);
    });
  });
});
