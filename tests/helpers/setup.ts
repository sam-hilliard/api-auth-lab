import { pool } from '../../src/db';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

// truncate tables before each test for isolation
beforeEach(async () => {
  await pool.query('TRUNCATE users, orgs, org_members RESTART IDENTITY CASCADE');
});

// close DB connection after all tests
afterAll(async () => {
  await pool.end();
});