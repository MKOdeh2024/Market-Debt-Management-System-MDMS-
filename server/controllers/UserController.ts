import { Router, Request, Response, NextFunction } from 'express';
import { UserService } from "../services/UserService";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { validateUserCreation, validateUserUpdate } from '../validators/userValidator';

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const users = await UserService.list();
  res.json(users);
});

// Search/filter endpoint
router.get(
  "/search",
  async (req: Request, res: Response): Promise<void> => {
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

    const users = await UserService.search({ role: role as string, name: name as string });
    res.json(users);
  }
);

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const user = await UserService.get(Number(req.params.id));
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
});

router.post(
  "/",
  validateUserCreation,
  async (req: Request, res: Response): Promise<void> => {
    const user = await UserService.create(req.body);
    res.status(201).json(user);
  }
);

router.put(
  "/:id",
  validateUserUpdate,
  async (req: Request, res: Response): Promise<void> => {
    const user = await UserService.update(Number(req.params.id), req.body);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  }
);

router.delete("/:id", roleMiddleware("admin"), async (req: Request, res: Response): Promise<void> => {
  const result = await UserService.delete(Number(req.params.id));
  if (!result) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json({ success: true });
});

export default router;
