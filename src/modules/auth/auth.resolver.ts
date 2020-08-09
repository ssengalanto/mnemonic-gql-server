import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';

import { CreateUserInput } from '@modules/user/inputs';
import { AppContext } from '@shared/interfaces';

import { AuthService } from './auth.service';
import { SigninUserInput } from './inputs';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  signup(
    @Args('payload') payload: CreateUserInput,
    @Context() { res }: AppContext,
  ): Promise<string> {
    return this.authService.signup(payload, res);
  }

  @Mutation(() => String)
  signin(
    @Args('payload') payload: SigninUserInput,
    @Context() { res }: AppContext,
  ): Promise<string> {
    return this.authService.signin(payload, res);
  }

  @Mutation(() => String)
  silentRefresh(
    @Args('token') token: string,
    @Context() { res }: AppContext,
  ): Promise<string | null> {
    return this.authService.silentRefresh(token, res);
  }
}
