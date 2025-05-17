import { Router, Request, Response } from "express";
import { SupportTicketService } from "../services/SupportTicketService";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { validateSupportTicketCreation } from '../validators/supportTicketValidator';

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
  validateSupportTicketCreation,
  async (req: Request, res: Response): Promise<void> => {
    const ticket = await SupportTicketService.create(req.body);
    res.status(201).json(ticket);
  }
);

router.put(
  "/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { user, subject, description, status } = req.body;
    const errors: string[] = [];

    if (user && typeof user !== 'string') {
      errors.push('User must be a string');
    }

    if (subject && typeof subject !== 'string') {
      errors.push('Subject must be a string');
    }

    if (description && typeof description !== 'string') {
      errors.push('Description must be a string');
    }

    if (status && typeof status !== 'string') {
      errors.push('Status must be a string');
    }

    if (errors.length > 0) {
      res.status(400).json({ errors });
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