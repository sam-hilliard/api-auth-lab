import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import orgRoutes from './routes/orgs'
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orgs', orgRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// generic error handler
app.use(
  (err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    res.status(500).json({
      message: 'Internal Server Error'
    });
  }
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

const SERVER_PORT = process.env.SERVER_PORT || 3000;
app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});
