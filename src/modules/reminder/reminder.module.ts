import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';

import { ReminderRepository } from './reminder.repository';
import { ReminderResolver } from './reminder.resolver';
import { ReminderService } from './reminder.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([ReminderRepository]),
  ],
  providers: [ReminderResolver, ReminderService],
  exports: [ReminderService],
})
export class ReminderModule {}
