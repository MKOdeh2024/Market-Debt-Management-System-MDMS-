import { Router, Request, Response, RequestHandler } from "express";
import { ProductService } from "../services/ProductService";
import { body, validationResult, query } from "express-validator";
import { validateProductCreation } from '../validators/productValidator';

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const products = await ProductService.list();
  res.json(products);
});

// Search/filter endpoint
router.get(
  "/search",
  async (req: Request, res: Response): Promise<void> => {
    const { name, category } = req.query;
    const errors: string[] = [];

    if (name && typeof name !== 'string') {
      errors.push('Name must be a string');
    }

    if (category && typeof category !== 'string') {
      errors.push('Category must be a string');
    }

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const products = await ProductService.search({ name: name as string, category: category as string });
    res.json(products);
  }
);

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const product = await ProductService.get(Number(req.params.id));
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }
  res.json(product);
});

router.post(
  "/",
  validateProductCreation as RequestHandler,
  async (req: Request, res: Response): Promise<void> => {
    const product = await ProductService.create(req.body);
    res.status(201).json(product);
  }
);

router.put(
  "/:id",
  [
    body("name").optional().notEmpty(),
    body("brand").optional().notEmpty(),
    body("category").optional().notEmpty(),
    body("barcode").optional().notEmpty(),
    body("price_per_unit").optional().isNumeric(),
    body("quantity_in_stock").optional().isInt(),
    body("tax").optional().isNumeric()
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const product = await ProductService.update(Number(req.params.id), req.body);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  }
);

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const result = await ProductService.delete(Number(req.params.id));
  if (!result) {
    res.status(404).json({ message: "Product not found" });
    return;
  }
  res.json({ success: true });
});

export default router; 