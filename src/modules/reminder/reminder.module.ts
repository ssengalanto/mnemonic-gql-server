import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@modules/user/user.module';

import { ReminderRepository } from './reminder.repository';
import { ReminderResolver } from './reminder.resolver';
import { ReminderService } from './reminder.service';

@Module({
  imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([ReminderRepository])],
  providers: [ReminderResolver, ReminderService],
  exports: [TypeOrmModule],
})
export class ReminderModule {}
