import { Router, Request, Response, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserService } from "../services/UserService";
import { UserRole } from "../entities/User";
import { validateRegistration } from '../validators/userValidator';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// Register
router.post(
  "/register",
  validateRegistration as RequestHandler,
  async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    const existing = await UserService.findByEmail(email);
    if (existing) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await UserService.create({ name, email, password_hash, role });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  }
);

// Login
router.post(
  "/login",
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const errors: string[] = [];

    if (!email || typeof email !== 'string') {
      errors.push('Email is required and must be a string');
    }

    if (!password || typeof password !== 'string') {
      errors.push('Password is required and must be a string');
    }

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const user = await UserService.findByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "12h" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }
);

export default router; 