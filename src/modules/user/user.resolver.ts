import { Injectable } from '@nestjs/common';
import { Query, Args } from '@nestjs/graphql';

import { User } from '@shared/typeorm/entities';

import { UserType } from './types';
import { UserService } from './user.service';

@Injectable()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  hello(): string {
    return 'hi';
  }

  @Query(() => UserType, { nullable: true })
  getById(@Args('id') id: string): Promise<User | undefined> {
    return this.userService.findById(id);
  }
}
