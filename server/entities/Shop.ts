import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Customer } from "./Customer";
import { Product } from "./Product";

@Entity()
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @ManyToOne(() => User, user => user.id)
  owner: User;

  @OneToMany(() => Customer, customer => customer.shop)
  customers: Customer[];

  @OneToMany(() => Product, product => product.shop)
  products: Product[];

  @OneToMany(() => User, user => user.shop)
  users: User[];
} 