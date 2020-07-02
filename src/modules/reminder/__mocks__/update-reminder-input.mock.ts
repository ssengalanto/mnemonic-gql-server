import faker from 'faker';

import { UpdateReminderInput } from '../inputs';

export const updateReminderInputMockData: UpdateReminderInput = {
  name: faker.random.word(),
  date: faker.date.recent(),
  completed: faker.random.boolean(),
};
