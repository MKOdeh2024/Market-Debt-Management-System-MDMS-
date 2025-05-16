import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.notifications)
  user: User;

  @Column()
  type: string; // SMS, Email, In-app

  @Column("text")
  message: string;

  @Column({ default: "pending" })
  status: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
} 