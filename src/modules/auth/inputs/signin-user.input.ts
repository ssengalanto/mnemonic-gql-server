import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class SigninUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(5)
  password: string;
}
