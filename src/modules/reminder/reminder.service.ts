import { Injectable } from '@nestjs/common';

import { Reminder } from '@shared/typeorm/entities';
import { AuthenticatedUser } from '@shared/interfaces';

import { CreateReminderInput } from './inputs';
import { ReminderRepository } from './reminder.repository';

@Injectable()
export class ReminderService {
  constructor(private readonly reminderRepository: ReminderRepository) {}

  async findById(id: string): Promise<Reminder | null> {
    const reminder = await this.reminderRepository.findById(id);
    return reminder;
  }

  async findAll(): Promise<Reminder[]> {
    const reminders = await this.reminderRepository.find();
    return reminders;
  }

  async create(payload: CreateReminderInput, user: AuthenticatedUser): Promise<Reminder> {
    const reminder = await this.reminderRepository.createOne(payload, user);
    return reminder;
  }

  async delete(id: string, userId: string): Promise<Reminder | null> {
    const reminder = await this.reminderRepository.deleteOne(id, userId);
    return reminder;
  }

  async findUserReminders(id: string): Promise<Reminder[]> {
    const reminders = await this.reminderRepository.find({ where: { userId: id } });
    return reminders;
  }
}
