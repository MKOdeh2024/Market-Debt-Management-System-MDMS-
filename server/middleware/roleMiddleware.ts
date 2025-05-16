import { Response, NextFunction, RequestHandler } from "express";
import { AuthRequest } from "./authMiddleware";

export function roleMiddleware(...roles: string[]): RequestHandler {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };
}