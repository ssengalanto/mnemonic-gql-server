import faker from 'faker';

import { CreateUserInput } from '../inputs';

export const createUserInputMockData: CreateUserInput = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  active: true,
};
