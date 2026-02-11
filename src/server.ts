import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
