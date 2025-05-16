import { AppDataSource } from "../data-source";
import { ProductTransaction } from "../entities/ProductTransaction";

export class ProductTransactionService {
  static ptRepo = AppDataSource.getRepository(ProductTransaction);

  static async list() {
    return this.ptRepo.find();
  }

  static async get(id: number) {
    return this.ptRepo.findOneBy({ id });
  }

  static async create(data: Partial<ProductTransaction>) {
    const pt = this.ptRepo.create(data);
    return this.ptRepo.save(pt);
  }

  static async update(id: number, data: Partial<ProductTransaction>) {
    const pt = await this.ptRepo.findOneBy({ id });
    if (!pt) return null;
    Object.assign(pt, data);
    return this.ptRepo.save(pt);
  }

  static async delete(id: number) {
    const result = await this.ptRepo.delete(id);
    return result.affected ? true : false;
  }
} 