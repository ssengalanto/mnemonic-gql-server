import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateReminderInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  completed?: boolean;

  @Field()
  date: Date;
}
