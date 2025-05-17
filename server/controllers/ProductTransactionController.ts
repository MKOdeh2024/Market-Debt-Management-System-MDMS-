import { Router, Request, Response } from "express";
import { ProductTransactionService } from "../services/ProductTransactionService";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { validateProductTransactionCreation } from '../validators/productTransactionValidator';

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const pts = await ProductTransactionService.list();
  res.json(pts);
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const pt = await ProductTransactionService.get(Number(req.params.id));
  if (!pt) {
    res.status(404).json({ message: "ProductTransaction not found" });
    return;
  }
  res.json(pt);
});

router.post(
  "/",
  validateProductTransactionCreation,
  async (req: Request, res: Response): Promise<void> => {
    const pt = await ProductTransactionService.create(req.body);
    res.status(201).json(pt);
  }
);

router.put(
  "/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { debtTransaction, product, quantity, price_at_sale } = req.body;
    const errors: string[] = [];

    if (debtTransaction && typeof debtTransaction !== 'string') {
      errors.push('DebtTransaction must be a string');
    }

    if (product && typeof product !== 'string') {
      errors.push('Product must be a string');
    }

    if (quantity && typeof quantity !== 'number') {
      errors.push('Quantity must be a number');
    }

    if (price_at_sale && typeof price_at_sale !== 'number') {
      errors.push('Price at sale must be a number');
    }

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const pt = await ProductTransactionService.update(Number(req.params.id), req.body);
    if (!pt) {
      res.status(404).json({ message: "ProductTransaction not found" });
      return;
    }
    res.json(pt);
  }
);

router.delete("/:id", roleMiddleware("admin", "cashier"), async (req: Request, res: Response): Promise<void> => {
  const result = await ProductTransactionService.delete(Number(req.params.id));
  if (!result) {
    res.status(404).json({ message: "ProductTransaction not found" });
    return;
  }
  res.json({ success: true });
});

export default router; 