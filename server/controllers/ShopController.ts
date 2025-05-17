import { Router, Request, Response } from "express";
import { ShopService } from "../services/ShopService";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { validateShopCreation } from '../validators/shopValidator';

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const shops = await ShopService.list();
  res.json(shops);
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const shop = await ShopService.get(Number(req.params.id));
  if (!shop) {
    res.status(404).json({ message: "Shop not found" });
    return;
  }
  res.json(shop);
});

router.post(
  "/",
  validateShopCreation,
  async (req: Request, res: Response): Promise<void> => {
    const shop = await ShopService.create(req.body);
    res.status(201).json(shop);
  }
);

router.put(
  "/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { name, address } = req.body;
    const errors: string[] = [];

    if (name && typeof name !== 'string') {
      errors.push('Name must be a string');
    }

    if (address && typeof address !== 'string') {
      errors.push('Address must be a string');
    }

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const shop = await ShopService.update(Number(req.params.id), req.body);
    if (!shop) {
      res.status(404).json({ message: "Shop not found" });
      return;
    }
    res.json(shop);
  }
);

router.delete("/:id", roleMiddleware("admin"), async (req: Request, res: Response): Promise<void> => {
  const result = await ShopService.delete(Number(req.params.id));
  if (!result) {
    res.status(404).json({ message: "Shop not found" });
    return;
  }
  res.json({ success: true });
});

export default router; 