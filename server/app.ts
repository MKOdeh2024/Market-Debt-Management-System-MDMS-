import express from "express";
import UserController from "./controllers/UserController";
import ShopController from "./controllers/ShopController";
import CustomerController from "./controllers/CustomerController";
import ProductController from "./controllers/ProductController";
import DebtTransactionController from "./controllers/DebtTransactionController";
import ProductTransactionController from "./controllers/ProductTransactionController";
import AuditLogController from "./controllers/AuditLogController";
import SupportTicketController from "./controllers/SupportTicketController";
import NotificationController from "./controllers/NotificationController";
import AuthController from "./controllers/AuthController";
import { authMiddleware } from "./middleware/authMiddleware";
import { roleMiddleware } from "./middleware/roleMiddleware";
import { query, validationResult } from "express-validator";

const app = express();

app.use(express.json());

// Auth routes (register, login)
app.use("/api/v1/auth", AuthController);

// Protect all routes below with JWT auth
app.use('/api/v1', authMiddleware);

// Example: Only admin can delete users
app.use("/api/v1/users", UserController);
// In UserController, add roleMiddleware("admin") to DELETE route
// Example: app.delete('/:id', roleMiddleware('admin'), ...)

app.use("/api/v1/shops", ShopController);
app.use("/api/v1/customers", CustomerController);
app.use("/api/v1/products", ProductController);
app.use("/api/v1/debt-transactions", DebtTransactionController);
app.use("/api/v1/product-transactions", ProductTransactionController);
app.use("/api/v1/audit-logs", AuditLogController);
app.use("/api/v1/support-tickets", SupportTicketController);
app.use("/api/v1/notifications", NotificationController);

// Example: User search/filter endpoint
app.get(
  "/api/v1/users/search",
  [query("role").optional().isString(), query("name").optional().isString()],
  async (req : any, res : any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    // Implement search logic in UserService
    // e.g., UserService.search({ role: req.query.role, name: req.query.name })
    res.json([]); // Placeholder
  }
);

// Example: Product search/filter endpoint
app.get(
  "/api/v1/products/search",
  [query("name").optional().isString(), query("category").optional().isString()],
  async (req : any, res : any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    // Implement search logic in ProductService
    // e.g., ProductService.search({ name: req.query.name, category: req.query.category })
    res.json([]); // Placeholder
  }
);

// 404 handler
app.use((req : any, res : any, next : any) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handler
app.use((err : any, req : any, res : any, next : any) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

export default app; 