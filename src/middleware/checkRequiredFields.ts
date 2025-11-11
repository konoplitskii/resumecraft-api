import { error } from 'console';
import { Request, Response, NextFunction } from 'express';

export function checkRequiredFields(requiredFields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing = requiredFields.filter((f) => !(f in req.body));
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Отсутствуют обязательные поля: ${missing.join(', ')}`,
        error: 'MISSING_REQUIRED_FIELDS',
      });
    }
    next();
  };
}
