import { Query, Args, Resolver, ResolveField, Parent } from '@nestjs/graphql';

import { User, Reminder } from '@shared/typeorm/entities';

import { UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from '@shared/interfaces';
import { ReminderType } from '@modules/reminder/types';
import { CurrentUser, GqlAuthGuard } from '@shared/decorators';

import { UserType } from './types';
import { UserService } from './user.service';
import { ReminderService } from '@modules/reminder/reminder.service';

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly reminderService: ReminderService,
  ) {}

  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  hello(@CurrentUser() user: AuthenticatedUser): string {
    console.log(user);
    return 'hi';
  }

  @Query(() => UserType, { name: 'user', nullable: true })
  getById(@Args('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }

  @Query(() => [UserType], { name: 'users' })
  getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ResolveField(() => [ReminderType])
  reminders(@Parent() user: User): Promise<Reminder[]> {
    return this.reminderService.findReminderByUserId(user.id);
  }
}
