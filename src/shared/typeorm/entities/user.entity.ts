import { Entity, Column } from 'typeorm';

import { BaseOrmEntity } from '@shared/types';

@Entity()
export class User extends BaseOrmEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;
}
