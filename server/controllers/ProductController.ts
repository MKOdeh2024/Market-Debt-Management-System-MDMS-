import { Router, Request, Response, RequestHandler, NextFunction } from "express";
import { ProductService } from "../services/ProductService";
import { validateProductCreation, validateProductSearch } from '../validators/productValidator';

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const products = await ProductService.list();
  res.json(products);
});

// Search/filter endpoint
router.get(
  "/search",
  validateProductSearch as RequestHandler,
  async (req: Request, res: Response): Promise<void> => {
    const products = await ProductService.search({ name: req.query.name as string, category: req.query.category as string });
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

const validateProductUpdate: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const { name, brand, category, barcode, price_per_unit, quantity_in_stock, tax } = req.body;
  const errors: string[] = [];

  if (name && typeof name !== 'string') errors.push('Name must be a string');
  if (brand && typeof brand !== 'string') errors.push('Brand must be a string');
  if (category && typeof category !== 'string') errors.push('Category must be a string');
  if (barcode && typeof barcode !== 'string') errors.push('Barcode must be a string');
  if (price_per_unit && typeof price_per_unit !== 'number') errors.push('Price per unit must be a number');
  if (quantity_in_stock && !Number.isInteger(quantity_in_stock)) errors.push('Quantity in stock must be an integer');
  if (tax && typeof tax !== 'number') errors.push('Tax must be a number');

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
};

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
  validateProductUpdate,
  async (req: Request, res: Response): Promise<void> => {
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
