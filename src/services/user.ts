import bcrypt from 'bcryptjs';
import { pool } from '../db';
import { IUser } from '../types/user.types';

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return rows[0] || null;
};

/**
 * Хэширование пароля
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

/**
 * Сравнение пароля с хэшем
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
