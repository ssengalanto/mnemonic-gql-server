import { Entity, Column, OneToMany } from 'typeorm';

import { BaseOrmEntity } from '@shared/types';
import { Reminder } from './reminders.entity';

@Entity()
export class User extends BaseOrmEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @OneToMany(
    () => Reminder,
    (reminder) => reminder.user,
  )
  reminders?: Reminder[];
}
