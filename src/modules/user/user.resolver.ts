import { Query, Args, Resolver } from '@nestjs/graphql';

import { User } from '@shared/typeorm/entities';

import { UserType } from './types';
import { UserService } from './user.service';
import { AuthenticatedUser } from '@shared/interfaces';
import { CurrentUser, GqlAuthGuard } from '@shared/decorators';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

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
}
