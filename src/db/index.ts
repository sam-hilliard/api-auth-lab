import { Pool } from 'pg';
import 'dotenv/config';

const { 
    POSTGRES_USER, 
    POSTGRES_PASSWORD, 
    POSTGRES_DB, 
    POSTGRES_HOST,
    POSTGRES_PORT } = process.env

const DATABASE_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`

export const pool = new Pool({
  connectionString: DATABASE_URL,
});