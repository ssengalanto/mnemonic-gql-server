import { EntityRepository, Repository } from 'typeorm';

import { Reminder } from '@shared/typeorm/entities';
import { AuthenticatedUser } from '@shared/interfaces';

import { CreateReminderInput } from './inputs';

@EntityRepository(Reminder)
export class ReminderRepository extends Repository<Reminder> {
  async findById(id: string): Promise<Reminder | null> {
    const reminder = await this.findOne(id);

    if (!reminder) return null;
    return reminder;
  }

  async createOne(payload: CreateReminderInput, user: AuthenticatedUser): Promise<Reminder> {
    const reminder = this.create({ ...payload, user });
    await this.save(reminder);
    return reminder;
  }

  async deleteOne(id: string, userId: string): Promise<Reminder | null> {
    const reminder = await this.findOne(id, { where: { userId } });

    if (!reminder) return null;

    await this.delete(id);
    return reminder;
  }
}
