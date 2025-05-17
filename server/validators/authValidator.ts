import { Request, Response, NextFunction } from 'express';

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role } = req.body;
  const errors: string[] = [];

  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string');
  }

  if (!email || typeof email !== 'string') {
    errors.push('Email is required and must be a string');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required and must be a string');
  }

  if (!role || typeof role !== 'string') {
    errors.push('Role is required and must be a string');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}; 