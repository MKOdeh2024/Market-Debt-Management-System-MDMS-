import { Router, Request, Response } from "express";
import { ProductTransactionService } from "../services/ProductTransactionService";
import { body, validationResult } from "express-validator";
import { roleMiddleware } from "../middleware/roleMiddleware";

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
  [
    body("debtTransaction").notEmpty(),
    body("product").notEmpty(),
    body("quantity").isInt(),
    body("price_at_sale").isNumeric()
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const pt = await ProductTransactionService.create(req.body);
    res.status(201).json(pt);
  }
);

router.put(
  "/:id",
  [
    body("debtTransaction").optional().notEmpty(),
    body("product").optional().notEmpty(),
    body("quantity").optional().isInt(),
    body("price_at_sale").optional().isNumeric()
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
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