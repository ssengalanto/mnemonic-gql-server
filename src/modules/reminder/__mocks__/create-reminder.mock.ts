import faker from 'faker';

import { CreateReminderInput } from '../inputs';

export const createReminderInputMockData: CreateReminderInput = {
  name: faker.random.word(),
  date: faker.date.recent(),
  completed: faker.random.boolean(),
};
