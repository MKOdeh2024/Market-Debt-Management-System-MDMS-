import AppDataSource from "../data-source";
import { User } from "../entities/User";

export class UserService {
  static userRepo = AppDataSource.getRepository(User);

  static async list(): Promise<User[]> {
    return this.userRepo.find();
  }

  static async search(filters: { role?: string; name?: string }): Promise<User[]> {
    const query = this.userRepo.createQueryBuilder("user");

    if (filters.role) {
      query.andWhere("user.role = :role", { role: filters.role });
    }
    if (filters.name) {
      query.andWhere("user.name LIKE :name", { name: `%${filters.name}%` });
    }

    return query.getMany();
  }

  static async get(id: number): Promise<User | null> {
    return this.userRepo.findOneBy({ id });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOneBy({ email });
  }

  static async create(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  static async update(id: number, data: Partial<User>): Promise<User | null> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      return null;
    }
    Object.assign(user, data);
    return this.userRepo.save(user);
  }

  static async delete(id: number): Promise<boolean> {
    const result = await this.userRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
