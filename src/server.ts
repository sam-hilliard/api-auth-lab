import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import orgRoutes from './routes/orgs'
import { authenticateToken } from './middleware/auth';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 3000;

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});
