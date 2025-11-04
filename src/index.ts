import express, { Request, Response } from 'express';
import authRouters from './routes/auth';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use('/api', [authRouters]);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
