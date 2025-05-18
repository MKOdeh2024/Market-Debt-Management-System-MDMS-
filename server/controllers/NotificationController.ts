import { Router, Request, Response, NextFunction, RequestHandler } from "express";
import { NotificationService } from "../services/NotificationService";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

const validateNotificationCreation: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const { user, type, message, status } = req.body;
  const errors: string[] = [];

  if (!user) errors.push('User is required');
  if (!type) errors.push('Type is required');
  if (!message) errors.push('Message is required');
  if (status !== undefined && typeof status !== 'string') errors.push('Status must be a string');

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
};

const validateNotificationUpdate: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const { user, type, message, status } = req.body;
  const errors: string[] = [];

  if (user !== undefined && !user) errors.push('User cannot be empty');
  if (type !== undefined && !type) errors.push('Type cannot be empty');
  if (message !== undefined && !message) errors.push('Message cannot be empty');
  if (status !== undefined && typeof status !== 'string') errors.push('Status must be a string');

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
};

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
  validateNotificationCreation,
  async (req: Request, res: Response): Promise<void> => {
    const notification = await NotificationService.create(req.body);
    res.status(201).json(notification);
  }
);

router.put(
  "/:id",
  validateNotificationUpdate,
  async (req: Request, res: Response): Promise<void> => {
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
