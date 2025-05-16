import { AppDataSource } from "../data-source";
import { SupportTicket } from "../entities/SupportTicket";

export class SupportTicketService {
  static ticketRepo = AppDataSource.getRepository(SupportTicket);

  static async list() {
    return this.ticketRepo.find();
  }

  static async get(id: number) {
    return this.ticketRepo.findOneBy({ id });
  }

  static async create(data: Partial<SupportTicket>) {
    const ticket = this.ticketRepo.create(data);
    return this.ticketRepo.save(ticket);
  }

  static async update(id: number, data: Partial<SupportTicket>) {
    const ticket = await this.ticketRepo.findOneBy({ id });
    if (!ticket) return null;
    Object.assign(ticket, data);
    return this.ticketRepo.save(ticket);
  }

  static async delete(id: number) {
    const result = await this.ticketRepo.delete(id);
    return result.affected ? true : false;
  }
} 