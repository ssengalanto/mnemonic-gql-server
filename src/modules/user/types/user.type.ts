import { ObjectType, Field } from '@nestjs/graphql';

import { BaseGqlType } from '@shared/types';

@ObjectType('User')
export class UserType extends BaseGqlType {
  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  active: boolean;
}
