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
  first_name: string;

  @Field()
  @IsNotEmpty()
  last_name: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
