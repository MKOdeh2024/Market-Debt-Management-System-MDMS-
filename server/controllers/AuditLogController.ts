import { Router, Request, Response, RequestHandler } from 'express';
import { AuditLogService } from "../services/AuditLogService";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { validateAuditLogCreation } from '../validators/auditLogValidator';

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const logs = await AuditLogService.list();
  res.json(logs);
});

router.get("/:id", async (req: Request, res: Response) => {
  const log = await AuditLogService.get(Number(req.params.id));
  if (!log) {
    res.status(404).json({ message: "AuditLog not found" });
    return;
  }
  res.json(log);
});

router.post(
  "/",
  validateAuditLogCreation as RequestHandler,
  async (req: Request, res: Response) => {
    const log = await AuditLogService.create(req.body);
    res.status(201).json(log);
  }
);

router.put(
  "/:id",
  async (req: Request, res: Response) => {
    const { user, action, entity_type, entity_id, details } = req.body;
    const errors: string[] = [];

    if (user && typeof user !== 'string') {
      errors.push('User must be a string');
    }

    if (action && typeof action !== 'string') {
      errors.push('Action must be a string');
    }

    if (entity_type && typeof entity_type !== 'string') {
      errors.push('Entity type must be a string');
    }

    if (entity_id && typeof entity_id !== 'string') {
      errors.push('Entity ID must be a string');
    }

    if (details && typeof details !== 'string') {
      errors.push('Details must be a string');
    }

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const log = await AuditLogService.update(Number(req.params.id), req.body);
    if (!log) {
      res.status(404).json({ message: "AuditLog not found" });
      return;
    }
    res.json(log);
  }
);

router.delete("/:id", roleMiddleware("admin"), async (req: Request, res: Response) => {
  const result = await AuditLogService.delete(Number(req.params.id));
  if (!result) {
    res.status(404).json({ message: "AuditLog not found" });
    return;
  }
  res.json({ success: true });
});

export default router; 