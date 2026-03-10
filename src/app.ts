import express, { Request, Response, NextFunction } from 'express';
import { AppError } from './errors/AppError';
import { authenticateToken } from './middlewares/authMiddleware';
import authRoutes from './routes/authRoutes';
import orgRoutes from './routes/orgRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(express.json());

// public routes

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// TODO: Create middleware for this
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
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});
app.use('/api/auth', authRoutes);

app.use(authenticateToken);

// private routes
app.use('/api/users', userRoutes);
app.use('/api/orgs', orgRoutes);

export default app;
