import { EntityRepository, Repository } from 'typeorm';

import { Reminder } from '@shared/typeorm/entities';

@EntityRepository(Reminder)
export class ReminderRepository extends Repository<Reminder> {}
