import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { comparePassword, getUserByEmail } from '../services/user';
import { pool } from '../db';
import { getTokenConfig } from '../utils/token';

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
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, created_at;`,
      [name, email, hashedPassword],
    );

    res.status(201).json({
      success: true,
      message: 'Пользователь успешно создан',
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error('Ошибка при создании пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  const { expiresIn, maxAge } = getTokenConfig();

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Неверный email или пароль',
      error: 'INVALID_CREDENTIALS',
    });
  }

  const isPasswordValid = await comparePassword(password, existingUser.password_hash);

  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Неверный email или пароль',
      error: 'INVALID_CREDENTIALS',
    });
  }

  const token = jwt.sign({ userId: existingUser.id, name: existingUser.full_name }, JWT_SECRET, {
    expiresIn: expiresIn,
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: maxAge,
  });

  res.status(200).json({
    success: true,
    message: 'Вход выполнен успешно',
    data: {
      user: {
        id: existingUser.id,
        name: existingUser.full_name,
        email: existingUser.email,
      },
    },
  });

  try {
  } catch (error: any) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
