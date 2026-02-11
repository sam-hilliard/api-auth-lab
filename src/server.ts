import express from 'express';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';


const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
