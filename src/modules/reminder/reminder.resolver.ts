import DataLoader from 'dataloader';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';

import { UserType } from '@modules/user/types';
import { UserLoader } from '@modules/user/loaders';
import { AuthenticatedUser } from '@shared/interfaces';
import { Reminder, User } from '@shared/typeorm/entities';
import { CurrentUser, GqlAuthGuard, Loader } from '@shared/decorators';

import { ReminderType } from './types';
import { CreateReminderInput } from './inputs';
import { ReminderService } from './reminder.service';

@Resolver(() => ReminderType)
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

  @ResolveField(() => UserType, { name: 'user' })
  getUser(
    @Parent() reminder: Reminder,
    @Loader(UserLoader.name) userLoader: DataLoader<Reminder['userId'], User>,
  ): Promise<User | null> {
    return userLoader.load(reminder.userId);
  }
}
