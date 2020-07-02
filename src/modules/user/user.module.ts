import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from '@modules/auth/auth.module';
import { DataLoaderInterceptor } from '@shared/interceptors';
import { ReminderModule } from '@modules/reminder/reminder.module';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserLoader } from './loaders';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => ReminderModule),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [
    UserResolver,
    UserService,
    UserLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
  exports: [TypeOrmModule],
})
export class UserModule {}
