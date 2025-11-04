import { Request, Response } from 'express';
import { pool } from '../db';
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING *;`,
      [name, email, password],
    );

    res.status(201).json({
      message: '✅ User created successfully',
      user: result.rows[0],
    });
  } catch (err: any) {
    console.error('❌ Error creating user:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};
