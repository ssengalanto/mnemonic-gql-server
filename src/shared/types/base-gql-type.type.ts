import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class BaseGqlType {
  @Field(() => ID)
  id: number;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field({ nullable: true })
  deleted_at?: Date;
}
