import { Router, Request, Response, RequestHandler } from "express";
import { CustomerService } from "../services/CustomerService";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { validateCustomerCreation } from '../validators/customerValidator';

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
  validateCustomerCreation as RequestHandler,
  async (req: Request, res: Response) => {
    const customer = await CustomerService.create(req.body);
    res.status(201).json(customer);
  }
);

router.put(
  "/:id",
  async (req: Request, res: Response) => {
    const { name, contact_info, status } = req.body;
    const errors: string[] = [];

    if (name && typeof name !== 'string') {
      errors.push('Name must be a string');
    }

    if (contact_info && typeof contact_info !== 'string') {
      errors.push('Contact info must be a string');
    }

    if (status && typeof status !== 'string') {
      errors.push('Status must be a string');
    }

    if (errors.length > 0) {
      res.status(400).json({ errors });
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