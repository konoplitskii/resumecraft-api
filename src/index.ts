import express, { Request, Response } from 'express';
import authRouters from './routes/auth';
import { createResumeTables } from './db/scripts';
import dotenv from 'dotenv';
import { pool } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use('/api', [authRouters]);

async function startServer() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connected to database at:', result.rows[0].now);

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
}

startServer();
