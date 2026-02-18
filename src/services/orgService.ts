import { pool } from '../db';
import { Org } from '../types/org';

export const createOrg = async (orgName: string) => {
    const result = await pool.query<Org>(
        'INSERT INTO orgs (name) VALUES ($1) RETURNING id, name',
        [orgName]
    );
    return result.rows[0];
}

export const addMember = async (orgId: number, userId: number, role: string) => {
    const result = await pool.query(
        'INSERT INTO org_members (org_id, user_id, role) VALUES ($1, $2, $3) RETURNING org_id, user_id, role',
        [orgId, userId, role]
    );

    return result.rows[0];
}