import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Shop } from "./entities/Shop";
import { Customer } from "./entities/Customer";
import { Product } from "./entities/Product";
import { DebtTransaction } from "./entities/DebtTransaction";
import { ProductTransaction } from "./entities/ProductTransaction";
import { AuditLog } from "./entities/AuditLog";
import { SupportTicket } from "./entities/SupportTicket";
import { Notification } from "./entities/Notification";

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "mdms",
  synchronize: true, // use migrations
  logging: false,
  entities: [
    User,
    Shop,
    Customer,
    Product,
    DebtTransaction,
    ProductTransaction,
    AuditLog,
    SupportTicket,
    Notification
  ],
  migrations: ["server/migrations/*.ts"],
  subscribers: [],
}); 

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

export default AppDataSource;