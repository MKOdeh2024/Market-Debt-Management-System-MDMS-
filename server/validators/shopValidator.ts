import { Request, Response, NextFunction } from 'express';

export const validateShopCreation = (req: Request, res: Response, next: NextFunction) => {
  const { name, location, owner_id } = req.body;
  const errors: string[] = [];

  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string');
  }

  if (!location || typeof location !== 'string') {
    errors.push('Location is required and must be a string');
  }

  if (!owner_id || typeof owner_id !== 'string') {
    errors.push('Owner ID is required and must be a string');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
  } else {
    next();
  }
};
