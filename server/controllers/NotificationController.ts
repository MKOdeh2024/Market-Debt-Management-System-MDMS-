import { Router, Request, Response } from "express";
import { NotificationService } from "../services/NotificationService";
import { body, validationResult } from "express-validator";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const notifications = await NotificationService.list();
  res.json(notifications);
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const notification = await NotificationService.get(Number(req.params.id));
  if (!notification) {
    res.status(404).json({ message: "Notification not found" });
    return;
  }
  res.json(notification);
});

router.post(
  "/",
  [
    body("user").notEmpty(),
    body("type").notEmpty(),
    body("message").notEmpty(),
    body("status").optional().isString()
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const notification = await NotificationService.create(req.body);
    res.status(201).json(notification);
  }
);

router.put(
  "/:id",
  [
    body("user").optional().notEmpty(),
    body("type").optional().notEmpty(),
    body("message").optional().notEmpty(),
    body("status").optional().isString()
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const notification = await NotificationService.update(Number(req.params.id), req.body);
    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }
    res.json(notification);
  }
);

router.delete("/:id", roleMiddleware("admin"), async (req: Request, res: Response): Promise<void> => {
  const result = await NotificationService.delete(Number(req.params.id));
  if (!result) {
    res.status(404).json({ message: "Notification not found" });
    return;
  }
  res.json({ success: true });
});

export default router; 