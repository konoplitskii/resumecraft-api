import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db';
import { getUserByEmail } from '../services/user';

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        error: 'Пользователь с таким email уже существует',
      });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at;`,
      [name, email, hashedPassword],
    );

    res.status(201).json({
      success: true,
      message: 'Пользователь успешно создан',
      data: result.rows[0],
    });
  } catch (err: any) {
    console.error('Ошибка при создании пользователя:', err);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: err.message,
    });
  }
};
