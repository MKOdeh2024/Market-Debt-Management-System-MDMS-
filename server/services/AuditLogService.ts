import { AppDataSource } from "../data-source";
import { AuditLog } from "../entities/AuditLog";

export class AuditLogService {
  static logRepo = AppDataSource.getRepository(AuditLog);

  static async list() {
    return this.logRepo.find();
  }

  static async get(id: number) {
    return this.logRepo.findOneBy({ id });
  }

  static async create(data: Partial<AuditLog>) {
    const log = this.logRepo.create(data);
    return this.logRepo.save(log);
  }

  static async update(id: number, data: Partial<AuditLog>) {
    const log = await this.logRepo.findOneBy({ id });
    if (!log) return null;
    Object.assign(log, data);
    return this.logRepo.save(log);
  }

  static async delete(id: number) {
    const result = await this.logRepo.delete(id);
    return result.affected ? true : false;
  }
} 