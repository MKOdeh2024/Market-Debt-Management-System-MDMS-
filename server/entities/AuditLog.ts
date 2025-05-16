import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.auditLogs)
  user: User;

  @Column()
  action: string;

  @Column()
  entity_type: string;

  @Column()
  entity_id: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  timestamp: Date;

  @Column("text")
  details: string;
} 