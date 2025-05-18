import { Request, Response, NextFunction } from 'express';

export const validateUserCreation = (req: Request, res: Response, next: NextFunction): void => {
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
    res.status(400).json({ errors });
    return;
  }

  next();
};


export const validateUserSearch = (req: Request, res: Response, next: NextFunction): void => {
  const { role, name } = req.query;
  const errors: string[] = [];

  if (role && typeof role !== 'string') {
    errors.push('Role must be a string');
  }

  if (name && typeof name !== 'string') {
    errors.push('Name must be a string');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};

export const validateRegistration = (req: Request, res: Response, next: NextFunction): void => {
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
    res.status(400).json({ errors });
    return;
  }

  next();
}; 

export const validateUserUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, role } = req.body;
  const errors: string[] = [];

  if (name && typeof name !== 'string') {
    errors.push('Name must be a string');
  }

  if (email && typeof email !== 'string') {
    errors.push('Email must be a string');
  }

  if (role && typeof role !== 'string') {
    errors.push('Role must be a string');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};
