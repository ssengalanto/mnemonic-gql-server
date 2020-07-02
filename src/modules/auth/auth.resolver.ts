import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';

import { User } from '@shared/typeorm/entities';
import { UserType } from '@modules/user/types';
import { CreateUserInput } from '@modules/user/inputs';
import { AppContext } from '@shared/interfaces';

import { AuthService } from './auth.service';
import { SigninUserInput } from './inputs';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserType)
  signup(@Args('payload') payload: CreateUserInput): Promise<User> {
    return this.authService.signup(payload);
  }

  @Mutation(() => String)
  signin(
    @Args('payload') payload: SigninUserInput,
    @Context() { res }: AppContext,
  ): Promise<string> {
    return this.authService.signin(payload, res);
  }
}
