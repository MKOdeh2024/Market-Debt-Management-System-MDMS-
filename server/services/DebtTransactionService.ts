import  AppDataSource  from "../data-source";
import { DebtTransaction } from "../entities/DebtTransaction";

export class DebtTransactionService {
  static transactionRepo = AppDataSource.getRepository(DebtTransaction);

  static async list() {
    return this.transactionRepo.find();
  }

  static async get(id: number) {
    return this.transactionRepo.findOneBy({ id });
  }

  static async create(data: Partial<DebtTransaction>) {
    const transaction = this.transactionRepo.create(data);
    return this.transactionRepo.save(transaction);
  }

  static async update(id: number, data: Partial<DebtTransaction>) {
    const transaction = await this.transactionRepo.findOneBy({ id });
    if (!transaction) return null;
    Object.assign(transaction, data);
    return this.transactionRepo.save(transaction);
  }

  static async delete(id: number) {
    const result = await this.transactionRepo.delete(id);
    return result.affected ? true : false;
  }
} 