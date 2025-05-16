import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { ILike } from "typeorm";

export class ProductService {
  static productRepo = AppDataSource.getRepository(Product);

  static async list() {
    return this.productRepo.find();
  }

  static async get(id: number) {
    return this.productRepo.findOneBy({ id });
  }

  static async search(filters: { name?: string; category?: string }) {
    const where: any = {};
    if (filters.name) where.name = ILike(`%${filters.name}%`);
    if (filters.category) where.category = ILike(`%${filters.category}%`);
    return this.productRepo.find({ where });
  }

  static async create(data: Partial<Product>) {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  static async update(id: number, data: Partial<Product>) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) return null;
    Object.assign(product, data);
    return this.productRepo.save(product);
  }

  static async delete(id: number) {
    const result = await this.productRepo.delete(id);
    return result.affected ? true : false;
  }
} 