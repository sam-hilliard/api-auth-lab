import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { authenticateToken } from './middlewares/authMiddleware';
import { errorHandler } from './middlewares/errorMiddleware';
import authRoutes from './routes/authRoutes';
import orgRoutes from './routes/orgRoutes';
import userRoutes from './routes/userRoutes';
import { apiRateLimit } from './middlewares/rateLimitMiddleware';

const app = express();

// security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

app.use(express.json());

// logging
app.use(morgan('combined'));

// rate limiting
app.use(apiRateLimit);

// public routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});
app.use('/api/auth', authRoutes);

app.use(authenticateToken);

// private routes
app.use('/api/users', userRoutes);
app.use('/api/orgs', orgRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorHandler);

export default app;
