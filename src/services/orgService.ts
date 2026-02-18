import { pool } from '../db';
import { User } from '../types/auth';

export const createOrg = async (orgName: string, ownerId: number) => {
    const result = await pool.query<User>(
        'INSERT INTO orgs (name, owner_id) VALUES ($1, $2) RETURNING id, name, owner_id',
        [orgName, ownerId]
    );
    return result.rows[0];
}