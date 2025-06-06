import express from "express";
import AppDataSource  from "./data-source";
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
import { validateUserSearch } from './validators/userValidator';
import { validateProductSearch } from './validators/productValidator';

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
  validateUserSearch,
  async (req : any, res : any) => {
    // Implement search logic in UserService
    res.json([]); // Placeholder
  }
);

// Example: Product search/filter endpoint
app.get(
  "/api/v1/products/search",
  validateProductSearch,
  async (req : any, res : any) => {
    // Implement search logic in ProductService
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

app.listen(4000, () => {
  AppDataSource.initialize();
  console.log("Server is running on port 5000");
});

export default app; 