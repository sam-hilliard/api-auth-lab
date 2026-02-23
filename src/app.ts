import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import orgRoutes from './routes/orgs';
import { authenticateToken } from './middleware/auth';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/orgs', authenticateToken, orgRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// generic error handler
app.use(
  (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

export default app;
