import { join } from 'path';
import { Module } from '@nestjs/common';
import { Request, Response } from 'express';
import { GraphQLModule } from '@nestjs/graphql';

import { AppContext } from '@shared/interfaces';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }: { req: Request; res: Response }): AppContext => ({ req, res }),
    }),
    UserModule,
  ],
})
export class AppModule {}
