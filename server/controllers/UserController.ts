import { Router, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { body, query, validationResult } from "express-validator";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const users = await UserService.list();
  res.json(users);
});

// Search/filter endpoint
router.get(
  "/search",
  [query("role").optional().isString(), query("name").optional().isString()],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const users = await UserService.search({ role: req.query.role as string, name: req.query.name as string });
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
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password_hash").isLength({ min: 6 }),
    body("role").isString()
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const user = await UserService.create(req.body);
    res.status(201).json(user);
  }
);

router.put(
  "/:id",
  [
    body("name").optional().notEmpty(),
    body("email").optional().isEmail(),
    body("password_hash").optional().isLength({ min: 6 }),
    body("role").optional().isString()
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
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