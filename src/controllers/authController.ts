import { Request, Response } from 'express';
export const registerUser = async (req: Request, res: Response) => {
  console.log('req', req.body);
  res
    .status(201)
    .json({ message: 'Пользователь создан', data: { result: true, userId: 'user.id' } });
};
