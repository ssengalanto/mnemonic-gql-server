import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { AuthenticatedUser } from '@shared/interfaces';
import { CurrentUser, GqlAuthGuard } from '@shared/decorators';
import { Reminder } from '@shared/typeorm/entities';

import { ReminderType } from './types';
import { CreateReminderInput } from './inputs';
import { ReminderService } from './reminder.service';

@Resolver()
export class ReminderResolver {
  constructor(private readonly reminderService: ReminderService) {}

  @Query(() => [ReminderType], { name: 'reminders' })
  getAll(): Promise<Reminder[]> {
    return this.reminderService.findAll();
  }

  @Query(() => ReminderType, { name: 'reminder', nullable: true })
  getById(@Args('id') id: string): Promise<Reminder | null> {
    return this.reminderService.findById(id);
  }

  @Mutation(() => ReminderType, { name: 'deleteReminder', nullable: true })
  @UseGuards(GqlAuthGuard)
  delete(@Args('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<Reminder | null> {
    return this.reminderService.delete(id, user.id);
  }

  @Mutation(() => ReminderType, { name: 'createReminder' })
  @UseGuards(GqlAuthGuard)
  create(
    @Args('payload') payload: CreateReminderInput,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Reminder> {
    return this.reminderService.create(payload, user);
  }
}
