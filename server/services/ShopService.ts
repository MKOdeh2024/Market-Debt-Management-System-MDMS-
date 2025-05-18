import AppDataSource  from "../data-source";
import { Shop } from "../entities/Shop";

export class ShopService {
  static shopRepo = AppDataSource.getRepository(Shop);

  static async list() {
    return this.shopRepo.find();
  }

  static async get(id: number) {
    return this.shopRepo.findOneBy({ id });
  }

  static async create(data: Partial<Shop>) {
    const shop = this.shopRepo.create(data);
    return this.shopRepo.save(shop);
  }

  static async update(id: number, data: Partial<Shop>) {
    const shop = await this.shopRepo.findOneBy({ id });
    if (!shop) return null;
    Object.assign(shop, data);
    return this.shopRepo.save(shop);
  }

  static async delete(id: number) {
    const result = await this.shopRepo.delete(id);
    return result.affected ? true : false;
  }
} 