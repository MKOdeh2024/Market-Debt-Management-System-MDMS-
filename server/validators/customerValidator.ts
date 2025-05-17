import { Request, Response, NextFunction } from 'express';

export const validateCustomerCreation = (req: Request, res: Response, next: NextFunction) => {
  const { name, contact_info, status } = req.body;
  const errors: string[] = [];

  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string');
  }

  if (!contact_info || typeof contact_info !== 'string') {
    errors.push('Contact info is required and must be a string');
  }

  if (!status || typeof status !== 'string') {
    errors.push('Status is required and must be a string');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}; 