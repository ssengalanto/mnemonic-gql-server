import { EntityRepository, Repository } from 'typeorm';

import { Reminder } from '@shared/typeorm/entities';
import { AuthenticatedUser } from '@shared/interfaces';

import { CreateReminderInput } from './inputs';

@EntityRepository(Reminder)
export class ReminderRepository extends Repository<Reminder> {
  async createOne(payload: CreateReminderInput, user: AuthenticatedUser): Promise<Reminder> {
    const task = this.create({ ...payload, user });
    await this.save(task);
    return task;
  }
}
