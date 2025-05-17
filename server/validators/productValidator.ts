import { Request, Response, NextFunction } from 'express';

export const validateProductCreation = (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price, category } = req.body;
  const errors: string[] = [];

  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string');
  }

  if (!description || typeof description !== 'string') {
    errors.push('Description is required and must be a string');
  }

  if (!price || typeof price !== 'number') {
    errors.push('Price is required and must be a number');
  }

  if (!category || typeof category !== 'string') {
    errors.push('Category is required and must be a string');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
  } else {
    next();
  }
};


export const validateProductSearch = (req: Request, res: Response, next: NextFunction) => {
  const { name, category } = req.query;
  const errors: string[] = [];

  if (name && typeof name !== 'string') {
    errors.push('Name must be a string');
  }

  if (category && typeof category !== 'string') {
    errors.push('Category must be a string');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
  } else {
    next();
  }
}; 