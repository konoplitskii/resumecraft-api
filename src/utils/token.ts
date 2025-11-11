import { SignOptions } from 'jsonwebtoken';

export const getTokenConfig = (): {
  expiresIn: SignOptions['expiresIn'];
  maxAge: number;
} => {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '1h') as SignOptions['expiresIn'];
  const maxAge = process.env.JWT_COOKIE_MAX_AGE
    ? parseInt(process.env.JWT_COOKIE_MAX_AGE)
    : 60 * 60 * 1000;

  return { expiresIn, maxAge };
};
