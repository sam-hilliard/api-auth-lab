import express, { Request, Response, NextFunction } from 'express';
import { AppError } from './errors/AppError';
import { authenticateToken } from './middleware/auth';
import authRoutes from './routes/authRoutes';
import orgRoutes from './routes/orgs';
import userRoutes from './routes/users';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/orgs', authenticateToken, orgRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// generic error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {

  console.log(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
  } else {
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
});

export default app;
