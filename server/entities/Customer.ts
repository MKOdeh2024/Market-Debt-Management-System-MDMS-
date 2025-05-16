import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Shop } from "./Shop";
import { DebtTransaction } from "./DebtTransaction";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  contact_info: string;

  @Column({ default: "active" })
  status: string;

  @ManyToOne(() => Shop, shop => shop.customers)
  shop: Shop;

  @OneToMany(() => DebtTransaction, transaction => transaction.customer)
  transactions: DebtTransaction[];
} 