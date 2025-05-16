import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Customer } from "./Customer";
import { Shop } from "./Shop";
import { User } from "./User";
import { ProductTransaction } from "./ProductTransaction";

export enum DebtTransactionType {
  CREDIT = "credit",
  PAYMENT = "payment"
}

@Entity()
export class DebtTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, customer => customer.transactions)
  customer: Customer;

  @ManyToOne(() => Shop, shop => shop.id)
  shop: Shop;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column({ type: "enum", enum: DebtTransactionType })
  type: DebtTransactionType;

  @Column("decimal", { precision: 10, scale: 2 })
  total_amount: number;

  @Column({ default: "unpaid" })
  status: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @OneToMany(() => ProductTransaction, pt => pt.debtTransaction)
  productTransactions: ProductTransaction[];
} 