import { Router, Request, Response } from "express";
import { AuditLogService } from "../services/AuditLogService";
import { body, validationResult } from "express-validator";
import { roleMiddleware } from "../middleware/roleMiddleware";

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
  [
    body("user").notEmpty(),
    body("action").notEmpty(),
    body("entity_type").notEmpty(),
    body("entity_id").notEmpty(),
    body("details").notEmpty()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const log = await AuditLogService.create(req.body);
    res.status(201).json(log);
  }
);

router.put(
  "/:id",
  [
    body("user").optional().notEmpty(),
    body("action").optional().notEmpty(),
    body("entity_type").optional().notEmpty(),
    body("entity_id").optional().notEmpty(),
    body("details").optional().notEmpty()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
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