import { Router, Request, Response } from "express";
import { DebtTransactionService } from "../services/DebtTransactionService";
import { body, validationResult } from "express-validator";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

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
  [
    body("customer").notEmpty(),
    body("shop").notEmpty(),
    body("user").notEmpty(),
    body("type").isString(),
    body("total_amount").isNumeric(),
    body("status").optional().isString()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const transaction = await DebtTransactionService.create(req.body);
    res.status(201).json(transaction);
  }
);

router.put(
  "/:id",
  [
    body("customer").optional().notEmpty(),
    body("shop").optional().notEmpty(),
    body("user").optional().notEmpty(),
    body("type").optional().isString(),
    body("total_amount").optional().isNumeric(),
    body("status").optional().isString()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
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