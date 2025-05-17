import { Request, Response, NextFunction } from 'express';

export const validateAuditLogCreation = (req: Request, res: Response, next: NextFunction) => {

  const { user, action, entity_type, entity_id, details } = req.body;
  const errors: string[] = [];

  if (!user || typeof user !== 'string') {
    errors.push('User is required and must be a string');
  }

  if (!action || typeof action !== 'string') {
    errors.push('Action is required and must be a string');
  }

  if (!entity_type || typeof entity_type !== 'string') {
    errors.push('Entity type is required and must be a string');
  }

  if (!entity_id || typeof entity_id !== 'string') {
    errors.push('Entity ID is required and must be a string');
  }

  if (!details || typeof details !== 'string') {
    errors.push('Details are required and must be a string');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};