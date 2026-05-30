import { pool } from '../db';
import { Org } from '../types/orgTypes';

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

export const insertMember = async (orgId: number, userId: number, role: string) => {
  await pool.query('INSERT INTO org_members (org_id, user_id, role) VALUES ($1, $2, $3)', [
    orgId,
    userId,
    role,
  ]);
};

export const getMember = async (orgId: number, userId: number) => {
  const result = await pool.query('SELECT * FROM org_members WHERE org_id = $1 AND user_id = $2', [
    orgId,
    userId,
  ]);

  return result.rows[0];
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
