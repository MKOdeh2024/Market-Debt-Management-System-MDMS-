import { Router, Request, Response, NextFunction, RequestHandler } from "express";
import { DebtTransactionService } from "../services/DebtTransactionService";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

const validateDebtTransactionCreation: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const { customer, shop, user, type, total_amount, status } = req.body;
  const errors: string[] = [];

  if (!customer) errors.push('Customer is required');
  if (!shop) errors.push('Shop is required');
  if (!user) errors.push('User is required');
  if (!type || typeof type !== 'string') errors.push('Type is required and must be a string');
  if (total_amount === undefined || typeof total_amount !== 'number') errors.push('Total amount is required and must be a number');
  if (status !== undefined && typeof status !== 'string') errors.push('Status must be a string');

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
};

const validateDebtTransactionUpdate: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const { customer, shop, user, type, total_amount, status } = req.body;
  const errors: string[] = [];

  if (customer !== undefined && !customer) errors.push('Customer cannot be empty');
  if (shop !== undefined && !shop) errors.push('Shop cannot be empty');
  if (user !== undefined && !user) errors.push('User cannot be empty');
  if (type !== undefined && typeof type !== 'string') errors.push('Type must be a string');
  if (total_amount !== undefined && typeof total_amount !== 'number') errors.push('Total amount must be a number');
  if (status !== undefined && typeof status !== 'string') errors.push('Status must be a string');

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
};

router.get("/", async (req: Request, res: Response) => {
  const transactions = await DebtTransactionService.list();
  res.json(transactions);
});

router.get("/:id", async (req: Request, res: Response) => {
  const transaction = await DebtTransactionService.get(Number(req.params.id));
  if (!transaction) {
    res.status(404).json({ message: "Transaction not found" });
    return;
  }
  res.json(transaction);
});

router.post(
  "/",
  validateDebtTransactionCreation,
  async (req: Request, res: Response) => {
    const transaction = await DebtTransactionService.create(req.body);
    res.status(201).json(transaction);
  }
);

router.put(
  "/:id",
  validateDebtTransactionUpdate,
  async (req: Request, res: Response) => {
    const transaction = await DebtTransactionService.update(Number(req.params.id), req.body);
    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }
    res.json(transaction);
  }
);

router.delete("/:id", roleMiddleware("admin", "cashier"), async (req: Request, res: Response) => {
  const result = await DebtTransactionService.delete(Number(req.params.id));
  if (!result) {
    res.status(404).json({ message: "Transaction not found" });
    return;
  }
  res.json({ success: true });
});

export default router;
