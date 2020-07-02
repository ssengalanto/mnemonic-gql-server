import { ObjectType, Field } from '@nestjs/graphql';

import { BaseGqlType } from '@shared/types';

@ObjectType('User')
export class UserType extends BaseGqlType {
  @Field()
  email: string;

  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  active: boolean;
}
