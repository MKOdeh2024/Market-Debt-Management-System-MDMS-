import { Router, Request, Response } from "express";
import { CustomerService } from "../services/CustomerService";
import { body, validationResult } from "express-validator";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const customers = await CustomerService.list();
  res.json(customers);
});

router.get("/:id", async (req: Request, res: Response) => {
  const customer = await CustomerService.get(Number(req.params.id));
  if (!customer) {
    res.status(404).json({ message: "Customer not found" });
    return;
  }
  res.json(customer);
});

router.post(
  "/",
  [
    body("name").notEmpty(),
    body("contact_info").notEmpty(),
    body("status").optional().isString()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const customer = await CustomerService.create(req.body);
    res.status(201).json(customer);
  }
);

router.put(
  "/:id",
  [
    body("name").optional().notEmpty(),
    body("contact_info").optional().notEmpty(),
    body("status").optional().isString()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const customer = await CustomerService.update(Number(req.params.id), req.body);
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }
    res.json(customer);
  }
);

router.delete("/:id", roleMiddleware("admin"), async (req: Request, res: Response) => {
  const result = await CustomerService.delete(Number(req.params.id));
  if (!result) {
    res.status(404).json({ message: "Customer not found" });
    return;
  }
  res.json({ success: true });
});

export default router; 