import { AppError } from '../errors/AppError';
import { ClientError } from '../errors/ClientError';
import { NotFoundError } from '../errors/NotFoundError';
import {
  getMember,
  insertMember,
  deleteMember,
  getOrg,
  getMembers,
} from '../repositories/orgRepository';
import { findUserByUsername } from '../repositories/userRepository';

export const isOwner = async (orgId: number, userId: number) => {
  const member = await getMember(orgId, userId);
  if (!member) return false;
  return member.role === 'owner';
};

export const addMember = async (orgId: number, userId: number, role: string) => {
  await insertMember(orgId, userId, role);

  const org = await getOrg(orgId);
  const members = await getMembers(orgId);
  return {
    ...org,
    members,
  };
};

export const isMemberExists = async (orgId: number, userId: number) => {
  const member = await getMember(orgId, userId);
  return !!member;
};

export const inviteUserToOrg = async (orgId: number, username: string) => {
  const findUser = await findUserByUsername(username);

  if (!findUser) {
    throw new NotFoundError(`User does not exist with the username: ${username}`);
  }

  const userId = findUser.id;
  const memberExists = await isMemberExists(orgId, userId);
  if (memberExists) {
    throw new ClientError('User is already a member of the org');
  }

  return await addMember(orgId, userId, 'member');
};

export const removeMemberFromOrg = async (orgId: number, username: string) => {
  const findUser = await findUserByUsername(username);
  if (!findUser) throw new NotFoundError('User not found');

  const userId = Number(findUser.id);

  const removed = await deleteMember(orgId, userId);
  if (!removed) {
    throw new AppError(500, 'Unable to remove member.');
  }
};
