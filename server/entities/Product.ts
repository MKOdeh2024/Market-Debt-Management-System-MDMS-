import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Shop } from "./Shop";
import { ProductTransaction } from "./ProductTransaction";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  category: string;

  @Column({ unique: true })
  barcode: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price_per_unit: number;

  @Column("int")
  quantity_in_stock: number;

  @Column("decimal", { precision: 5, scale: 2, default: 0 })
  tax: number;

  @ManyToOne(() => Shop, shop => shop.products)
  shop: Shop;

  @OneToMany(() => ProductTransaction, pt => pt.product)
  productTransactions: ProductTransaction[];
} 