import dotenv from 'dotenv';
import { pool } from '../../src/db';
import { cleanUpDB } from './utils';

dotenv.config({ path: '.env.test' });

// close DB connection after all tests
afterAll(async () => {
  await cleanUpDB();
  await pool.end();
});
