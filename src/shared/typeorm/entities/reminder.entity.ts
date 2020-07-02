import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseOrmEntity } from '@shared/types';

import { User } from './user.entity';

@Entity()
export class Reminder extends BaseOrmEntity {
  @Column()
  name: string;

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @Column()
  date: Date;

  @ManyToOne(
    () => User,
    (user) => user.reminders,
  )
  user?: User;

  @Column()
  userId: string;
}
