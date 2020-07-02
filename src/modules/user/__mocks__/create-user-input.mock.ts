import faker from 'faker';

import { CreateUserInput } from '../inputs';

export const createUserInputMockData: CreateUserInput = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  active: true,
};
