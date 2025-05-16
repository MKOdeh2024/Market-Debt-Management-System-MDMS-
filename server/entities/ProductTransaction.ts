import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { DebtTransaction } from "./DebtTransaction";
import { Product } from "./Product";

@Entity()
export class ProductTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DebtTransaction, dt => dt.productTransactions)
  debtTransaction: DebtTransaction;

  @ManyToOne(() => Product, product => product.productTransactions)
  product: Product;

  @Column("int")
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price_at_sale: number;
} 