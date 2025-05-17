import { Request, Response, NextFunction } from 'express';

export const validateProductTransactionCreation = (req: Request, res: Response, next: NextFunction) => {
  const { product_id, quantity, transaction_type } = req.body;
  const errors: string[] = [];

  if (!product_id || typeof product_id !== 'string') {
    errors.push('Product ID is required and must be a string');
  }

  if (!quantity || typeof quantity !== 'number') {
    errors.push('Quantity is required and must be a number');
  }

  if (!transaction_type || typeof transaction_type !== 'string') {
    errors.push('Transaction type is required and must be a string');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
  } else {
    next();
  }
};



