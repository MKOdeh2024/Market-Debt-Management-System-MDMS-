import { AppDataSource } from "../data-source";
import { Notification } from "../entities/Notification";

export class NotificationService {
  static notificationRepo = AppDataSource.getRepository(Notification);

  static async list() {
    return this.notificationRepo.find();
  }

  static async get(id: number) {
    return this.notificationRepo.findOneBy({ id });
  }

  static async create(data: Partial<Notification>) {
    const notification = this.notificationRepo.create(data);
    return this.notificationRepo.save(notification);
  }

  static async update(id: number, data: Partial<Notification>) {
    const notification = await this.notificationRepo.findOneBy({ id });
    if (!notification) return null;
    Object.assign(notification, data);
    return this.notificationRepo.save(notification);
  }

  static async delete(id: number) {
    const result = await this.notificationRepo.delete(id);
    return result.affected ? true : false;
  }
} 