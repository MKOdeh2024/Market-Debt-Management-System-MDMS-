import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { ILike } from "typeorm";

export class UserService {
  static userRepo = AppDataSource.getRepository(User);

  static async list() {
    return this.userRepo.find();
  }

  static async get(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  static async findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  static async search(filters: { role?: string; name?: string }) {
    const where: any = {};
    if (filters.role) where.role = filters.role;
    if (filters.name) where.name = ILike(`%${filters.name}%`);
    return this.userRepo.find({ where });
  }

  static async create(data: Partial<User>) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  static async update(id: number, data: Partial<User>) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) return null;
    Object.assign(user, data);
    return this.userRepo.save(user);
  }

  static async delete(id: number) {
    const result = await this.userRepo.delete(id);
    return result.affected ? true : false;
  }
} 