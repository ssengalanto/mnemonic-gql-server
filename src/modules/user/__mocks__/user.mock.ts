import faker from 'faker';

import { User } from '@shared/typeorm/entities';

const createMockUser = (): User => ({
  id: faker.random.uuid(),
  email: faker.internet.email(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  password: faker.internet.password(),
  active: true,
  created_at: faker.date.recent(),
  updated_at: faker.date.recent(),
  deleted_at: null,
});

export const userMockData: User = createMockUser();

export const usersMockData: User[] = Array(3).fill(createMockUser());
