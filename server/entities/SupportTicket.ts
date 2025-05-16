import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class SupportTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.supportTickets)
  user: User;

  @Column()
  subject: string;

  @Column("text")
  description: string;

  @Column({ default: "open" })
  status: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
} 