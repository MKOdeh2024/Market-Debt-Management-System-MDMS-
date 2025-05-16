import { Router, Request, Response } from "express";
import { SupportTicketService } from "../services/SupportTicketService";
import { body, validationResult } from "express-validator";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const tickets = await SupportTicketService.list();
  res.json(tickets);
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const ticket = await SupportTicketService.get(Number(req.params.id));
  if (!ticket) {
    res.status(404).json({ message: "SupportTicket not found" });
    return;
  }
  res.json(ticket);
});

router.post(
  "/",
  [
    body("user").notEmpty(),
    body("subject").notEmpty(),
    body("description").notEmpty(),
    body("status").optional().isString()
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const ticket = await SupportTicketService.create(req.body);
    res.status(201).json(ticket);
  }
);

router.put(
  "/:id",
  [
    body("user").optional().notEmpty(),
    body("subject").optional().notEmpty(),
    body("description").optional().notEmpty(),
    body("status").optional().isString()
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const ticket = await SupportTicketService.update(Number(req.params.id), req.body);
    if (!ticket) {
      res.status(404).json({ message: "SupportTicket not found" });
      return;
    }
    res.json(ticket);
  }
);

router.delete("/:id", roleMiddleware("admin"), async (req: Request, res: Response): Promise<void> => {
  const result = await SupportTicketService.delete(Number(req.params.id));
  if (!result) {
    res.status(404).json({ message: "SupportTicket not found" });
    return;
  }
  res.json({ success: true });
});

export default router; 