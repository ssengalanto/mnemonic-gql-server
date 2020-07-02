import { join } from 'path';
import { Module } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppContext } from '@shared/interfaces';
import { TypeOrmFactory } from '@shared/typeorm';
import { UserModule } from '@modules/user/user.module';
import { validationSchema, validationOptions } from '@shared/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development'],
      validationSchema,
      validationOptions,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }: { req: Request; res: Response }): AppContext => ({ req, res }),
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmFactory,
    }),
    UserModule,
  ],
})
export class AppModule {}
