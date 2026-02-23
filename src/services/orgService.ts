import { pool } from '../db';
import { Org } from '../types/org';

export const createOrg = async (orgName: string) => {
    const result = await pool.query<Org>(
        'INSERT INTO orgs (name) VALUES ($1) RETURNING id, name',
        [orgName]
    );
    return result.rows[0];
};

export const getOrg = async (orgId: number) => {
  const result = await pool.query('SELECT id, name FROM orgs WHERE id = $1', [orgId]);
  return result.rows[0];
};

export const addMember = async (orgId: number, userId: number, role: string) => {
    const result = await pool.query(
        'INSERT INTO org_members (org_id, user_id, role) VALUES ($1, $2, $3)',
        [orgId, userId, role]
    );

  const org = await getOrg(orgId);
  const members = await getMembers(orgId);
  return {
      ...org,
      members
  }
};

export const isOwner = async (orgId: number, userId: number) => {
    const member = await getMember(orgId, userId);
    return member.role === 'owner';
};

export const getMember = async (orgId: number, userId: number) => {
    const result = await pool.query(
        'SELECT * FROM org_members WHERE org_id = $1 AND user_id = $2',   
        [orgId, userId]
    );

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
        [orgId]
    );

    return result.rows;
};

export const removeMember = async (orgId: number, userId: number) => {
  const deleteResult = await pool.query(
    `DELETE FROM org_members
     WHERE org_id = $1 AND user_id = $2`,
    [orgId, userId]
  );

  return deleteResult.rowCount === 1;
};
