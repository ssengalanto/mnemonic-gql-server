import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MinLength, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(5)
  password: string;

  @Field()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsNotEmpty()
  lastName: string;

  @Field()
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
