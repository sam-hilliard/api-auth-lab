import { pool } from '../db';
import { AppError } from '../errors/AppError';
import { ClientError } from '../errors/ClientError';
import { NotFoundError } from '../errors/NotFoundError';
import { Org } from '../types/org';
import { findUserByUsername } from './userService';

export const insertOrg = async (orgName: string) => {
  const result = await pool.query<Org>('INSERT INTO orgs (name) VALUES ($1) RETURNING id, name', [
    orgName,
  ]);
  return result.rows[0];
};

export const getOrg = async (orgId: number) => {
  const result = await pool.query('SELECT id, name FROM orgs WHERE id = $1', [orgId]);
  return result.rows[0];
};

export const addMember = async (orgId: number, userId: number, role: string) => {
  const result = await pool.query(
    'INSERT INTO org_members (org_id, user_id, role) VALUES ($1, $2, $3)',
    [orgId, userId, role],
  );

  if (result.rowCount === 0) return null;

  const org = await getOrg(orgId);
  const members = await getMembers(orgId);
  return {
    ...org,
    members,
  };
};

export const isOwner = async (orgId: number, userId: number) => {
  const member = await getMember(orgId, userId);
  if (!member) return false;
  return member.role === 'owner';
};

export const getMember = async (orgId: number, userId: number) => {
  const result = await pool.query('SELECT * FROM org_members WHERE org_id = $1 AND user_id = $2', [
    orgId,
    userId,
  ]);

  return result.rows[0];
};

export const isMemberExists = async (orgId: number, userId: number) => {
  const member = await getMember(orgId, userId);
  return !!member;
};

export const getMembers = async (orgId: number) => {
  const result = await pool.query(
    `SELECT u.username, om.role
         FROM org_members om
         JOIN users u
           ON u.id = om.user_id
         WHERE om.org_id = $1
         ORDER BY u.username`,
    [orgId],
  );

  return result.rows;
};

export const deleteMember = async (orgId: number, userId: number) => {
  const deleteResult = await pool.query(
    `DELETE FROM org_members
     WHERE org_id = $1 AND user_id = $2`,
    [orgId, userId],
  );

  return deleteResult.rowCount === 1;
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
