import { ObjectType, Field, Int } from '@nestjs/graphql';

import { BaseGqlType } from '@shared/types';

@ObjectType('Reminder')
export class ReminderType extends BaseGqlType {
  @Field()
  name: string;

  @Field()
  completed: boolean;

  @Field()
  date: Date;

  @Field(() => Int)
  userId: number;
}
