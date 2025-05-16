import { Router, Request, Response } from "express";
import { ShopService } from "../services/ShopService";
import { body, validationResult } from "express-validator";
import { roleMiddleware } from "../middleware/roleMiddleware";

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
  [
    body("name").notEmpty(),
    body("address").notEmpty()
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const shop = await ShopService.create(req.body);
    res.status(201).json(shop);
  }
);

router.put(
  "/:id",
  [
    body("name").optional().notEmpty(),
    body("address").optional().notEmpty()
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
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