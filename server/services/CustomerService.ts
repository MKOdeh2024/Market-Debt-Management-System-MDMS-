import { AppDataSource } from "../data-source";
import { Customer } from "../entities/Customer";

export class CustomerService {
  static customerRepo = AppDataSource.getRepository(Customer);

  static async list() {
    return this.customerRepo.find();
  }

  static async get(id: number) {
    return this.customerRepo.findOneBy({ id });
  }

  static async create(data: Partial<Customer>) {
    const customer = this.customerRepo.create(data);
    return this.customerRepo.save(customer);
  }

  static async update(id: number, data: Partial<Customer>) {
    const customer = await this.customerRepo.findOneBy({ id });
    if (!customer) return null;
    Object.assign(customer, data);
    return this.customerRepo.save(customer);
  }

  static async delete(id: number) {
    const result = await this.customerRepo.delete(id);
    return result.affected ? true : false;
  }
} 