import { Request, Response, NextFunction } from 'express';

export const validateSupportTicketCreation = (req: Request, res: Response, next: NextFunction) => {
  const { customer_id, issue_description, status } = req.body;
  const errors: string[] = [];

  if (!customer_id || typeof customer_id !== 'string') {
    errors.push('Customer ID is required and must be a string');
  }

  if (!issue_description || typeof issue_description !== 'string') {
    errors.push('Issue description is required and must be a string');
  }

  if (!status || typeof status !== 'string') {
    errors.push('Status is required and must be a string');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
  } else {
    next();
  }
};



