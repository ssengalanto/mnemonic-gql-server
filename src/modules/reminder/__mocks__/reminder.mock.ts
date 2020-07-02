import faker from 'faker';

import { Reminder } from '@shared/typeorm/entities';

const createMockReminder = (): Reminder => ({
  id: faker.random.uuid(),
  name: faker.random.word(),
  completed: faker.random.boolean(),
  date: faker.date.recent(),
  userId: faker.random.uuid(),
  created_at: faker.date.recent(),
  updated_at: faker.date.recent(),
  deleted_at: null,
});

export const reminderMockData: Reminder = createMockReminder();

export const remindersMockData: Reminder[] = Array.from({ length: 3 }, () => createMockReminder());
