import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Shop } from "./Shop";
import { AuditLog } from "./AuditLog";
import { SupportTicket } from "./SupportTicket";
import { Notification } from "./Notification";

export enum UserRole {
  ADMIN = "admin",
  CASHIER = "cashier",
  CUSTOMER = "customer"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ type: "enum", enum: UserRole })
  role: UserRole;

  @Column({ default: false })
  two_fa_enabled: boolean;

  @ManyToOne(() => Shop, shop => shop.users, { nullable: true })
  shop: Shop;

  @OneToMany(() => AuditLog, log => log.user)
  auditLogs: AuditLog[];

  @OneToMany(() => SupportTicket, ticket => ticket.user)
  supportTickets: SupportTicket[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];
} 