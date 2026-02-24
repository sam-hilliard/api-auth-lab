import { pool } from '../../src/db';
import dotenv from 'dotenv';
import { cleanUpDB } from './utils';

dotenv.config({ path: '.env.test' });

// close DB connection after all tests
afterAll(async () => {
  cleanUpDB();
  await pool.end();
});